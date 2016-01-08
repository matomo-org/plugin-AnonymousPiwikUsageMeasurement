<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\API\Request;
use Piwik\Common;
use Piwik\Settings\SystemSetting;
use Exception;
use Piwik\Settings\UserSetting;
use Piwik\UrlHelper;

/**
 * Defines Settings for AnonymousPiwikUsageMeasurement.
 */
class Settings extends \Piwik\Plugin\Settings
{
    /** @var SystemSetting */
    public $canUserOptOut;

    /** @var UserSetting */
    public $userTrackingEnabled;

    /** @var SystemSetting */
    public $trackToPiwik;

    /** @var SystemSetting */
    public $ownPiwikSiteId;

    /** @var SystemSetting */
    public $customPiwikSiteId;

    /** @var SystemSetting */
    public $customPiwikSiteUrl;

    /** @var SystemSetting */
    public $anonymizeCustomPiwik;

    /** @var SystemSetting */
    public $anonymizeSelfPiwik;

    protected function init()
    {
        $this->createLetUsersOptOutSetting();
        $this->createTrackToPiwikSetting();

        $this->createTrackToOwnPiwikSetting();
        $this->anonymizeSelfPiwikCheckbox();

        $this->createTrackToCustomSiteUrlSetting();
        $this->createTrackToCustomSiteIdSetting();

        $this->createUsersOptOutSetting();
        $this->anonymizeCustomPiwikCheckbox();
    }

    private function createLetUsersOptOutSetting()
    {
        $this->canUserOptOut = new SystemSetting('canUserOptOut', 'Let users disable anonymous tracking');
        $this->canUserOptOut->type  = static::TYPE_BOOL;
        $this->canUserOptOut->uiControlType = static::CONTROL_CHECKBOX;
        $this->canUserOptOut->description   = 'If enabled, logged in users can opt out in their plugin settings. Anonymous users cannot opt out.';
        $this->canUserOptOut->defaultValue  = true;
        $this->canUserOptOut->readableByCurrentUser = true;

        $this->addSetting($this->canUserOptOut);
    }

    private function createUsersOptOutSetting()
    {
        $this->userTrackingEnabled = new UserSetting('userTrackingEnabled', 'Piwik usage tracking enabled');
        $this->userTrackingEnabled->type  = static::TYPE_BOOL;
        $this->userTrackingEnabled->uiControlType = static::CONTROL_CHECKBOX;
        $this->userTrackingEnabled->defaultValue = true;
        $this->userTrackingEnabled->description = 'If enabled, anonymous usage data will be tracked. For example which pages are viewed and which reports are used most often. For more information contact your system administrator.';

        if ($this->canUserOptOut->getValue()) {
            // we show this setting only when a user can actually opt out
            $this->addSetting($this->userTrackingEnabled);
        }
    }

    private function createTrackToPiwikSetting()
    {
        $this->trackToPiwik = new SystemSetting('trackToPiwik', 'Send usage data to Piwik.org');
        $this->trackToPiwik->type  = static::TYPE_BOOL;
        $this->trackToPiwik->uiControlType = static::CONTROL_CHECKBOX;
        $this->trackToPiwik->introduction  = 'Send anonmyized usage data to the creator of Piwik';
        $this->trackToPiwik->description   = 'If enabled, anonymized usage data will be sent to demo-anonymous.piwik.org and the tracked data can be viewed there (the data is public). The collected data is used to improve Piwik. Thank you for making Piwik better!';
        $this->trackToPiwik->defaultValue  = true;
        $this->trackToPiwik->readableByCurrentUser = true;

        $this->addSetting($this->trackToPiwik);
    }

    private function createTrackToOwnPiwikSetting()
    {
        $this->ownPiwikSiteId = new SystemSetting('ownPiwikSiteId', 'Site Id');
        // ideally we would use a SELECT control and let user choose an existing site but this would make performance slow
        // since we'd always have to get all site ids in each request
        $this->ownPiwikSiteId->uiControlType = static::CONTROL_TEXT;
        $this->ownPiwikSiteId->type = static::TYPE_INT;
        $this->ownPiwikSiteId->introduction  = 'Send anonymize usage data to this Piwik';
        $this->ownPiwikSiteId->description   = 'If specified, anonymized usage data will be sent to the specified site in this Piwik.';
        $this->ownPiwikSiteId->defaultValue  = 0;
        $this->ownPiwikSiteId->readableByCurrentUser = true;
        $this->ownPiwikSiteId->validate = function ($idSite) {
            if (empty($idSite)) {
                return;
            }

            if (!is_numeric($idSite)) {
                throw new Exception("Site Id '$idSite' should be a number");
            }

            $idSite = (int) $idSite;
            try {
                $siteExists = Request::processRequest('SitesManager.getSiteFromId', array('idSite' => $idSite));
            } catch (Exception $e) {
                $siteExists = false;
            }

            if (!$siteExists) {
                throw new Exception("The specified idSite '$idSite' does not exist");
            }
        };

        $this->addSetting($this->ownPiwikSiteId);
    }

    private function createTrackToCustomSiteUrlSetting()
    {
        $this->customPiwikSiteUrl = new SystemSetting('customSiteUrl', 'Piwik Url');
        $this->customPiwikSiteUrl->readableByCurrentUser = true;
        $this->customPiwikSiteUrl->uiControlType = static::CONTROL_TEXT;
        $this->customPiwikSiteUrl->uiControlAttributes = array('placeHolder' => 'eg. http://example.com/piwik');
        $this->customPiwikSiteUrl->introduction  = 'Send anonymize usage data to a custom Piwik';
        $this->customPiwikSiteUrl->description   = '';
        $this->customPiwikSiteUrl->defaultValue  = '';
        $this->customPiwikSiteUrl->validate = function ($value, $setting) {
            if (empty($value)) {
                return;
            }

            if (!UrlHelper::isLookLikeUrl($value)) {
                throw new Exception("URL '$value' seems to be not a valid URL");
            }

            // TODO should we check if URL exists and is valid?!? might not work if instance is not connected to internet
        };
        $this->customPiwikSiteUrl->transform = function ($value) {
            if (empty($value)) {
                return '';
            }

            if (!Common::stringEndsWith($value, '/piwik.php')) {
                if (!Common::stringEndsWith($value, '/')) {
                    $value .= '/';
                }
                $value .= 'piwik.php';
            }

            return $value;
        };

        $this->addSetting($this->customPiwikSiteUrl);
    }

    private function createTrackToCustomSiteIdSetting()
    {
        $this->customPiwikSiteId = new SystemSetting('customSiteId', 'Site Id');
        $this->customPiwikSiteId->readableByCurrentUser = true;
        $this->customPiwikSiteId->type  = static::TYPE_INT;
        $this->customPiwikSiteId->uiControlType = static::CONTROL_TEXT;
        $this->customPiwikSiteId->uiControlAttributes = array('placeHolder' => 'eg. "2"');
        $this->customPiwikSiteId->description = 'If a URL and Site Id is specified, usage data will be sent to the custom Piwik instance.';
        $this->customPiwikSiteId->defaultValue = 0;
        $this->customPiwikSiteId->validate = function ($idSite) {
            if (empty($idSite)) {
                return;
            }

            if (!is_numeric($idSite)) {
                throw new Exception("Site Id '$idSite' should be a number");
            }
        };

        $this->addSetting($this->customPiwikSiteId);
    }

    private function anonymizeCustomPiwikCheckbox()
    {
        $this->anonymizeCustomPiwik = $this->anonymizationOption("anonymizeCustomPiwik");

        $this->addSetting($this->anonymizeCustomPiwik);
    }

    private function anonymizeSelfPiwikCheckbox()
    {
        $this->anonymizeSelfPiwik = $this->anonymizationOption("anonymizeSelfPiwik");

        $this->addSetting($this->anonymizeSelfPiwik);
    }

    private function anonymizationOption($optionName)
    {
        $optionCheckbox = new SystemSetting($optionName, 'Turn on anonymization');
        $optionCheckbox->type = static::TYPE_BOOL;
        $optionCheckbox->uiControlType = static::CONTROL_CHECKBOX;
        $optionCheckbox->introduction  = 'Send anonmyized usage data to the creator of Piwik';
        $optionCheckbox->description = 'If enabled, logged in users can opt out in their plugin settings. Anonymous users cannot opt out.';
        $optionCheckbox->defaultValue = true;
        $optionCheckbox->readableByCurrentUser = true;

        return $optionCheckbox;
    }
}
