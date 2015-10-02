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

/**
 * Defines Settings for AnonymousPiwikUsageMeasurement.
 */
class Settings extends \Piwik\Plugin\Settings
{
    /** @var SystemSetting */
    public $trackToPiwik;

    /** @var SystemSetting */
    public $ownPiwikSiteId;

    /** @var SystemSetting */
    public $customPiwikSiteId;

    /** @var SystemSetting */
    public $customPiwikSiteUrl;

    protected function init()
    {
        $this->setIntroduction('Configure up to three Piwik instances that will be used to track usage of this Piwik. The same data will be tracked to all enabled instances, this allows you to see which data is sent to Piwik (if enabled) and how your Piwik is used.');

        $this->createTrackToPiwikSetting();

        $this->createTrackToOwnPiwikSetting();

        $this->createTrackToCustomSiteUrlSetting();
        $this->createTrackToCustomSiteIdSetting();
    }

    private function createTrackToPiwikSetting()
    {
        $this->trackToPiwik = new SystemSetting('trackToPiwik', 'Send usage data to Piwik.org');
        $this->trackToPiwik->type  = static::TYPE_BOOL;
        $this->trackToPiwik->uiControlType = static::CONTROL_CHECKBOX;
        $this->trackToPiwik->introduction  = 'Send anonmyized usage data to the creator of Piwik';
        $this->trackToPiwik->description   = 'If enabled, anonymized usage data will be sent to demo.piwik.org and the tracked data can be viewed there. The collected data is used to improve Piwik. Thank you for making Piwik better!';
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
        $this->ownPiwikSiteId->introduction  = 'Send anonymize usage data to this Piwik';
        $this->ownPiwikSiteId->description   = 'If specified, anonymized usage data will be sent to the specified site in this Piwik.';
        $this->ownPiwikSiteId->defaultValue  = 0;
        $this->ownPiwikSiteId->readableByCurrentUser = true;

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
        $this->customPiwikSiteUrl->validate = function ($value, $setting) {
            if (empty($value)) {
                return;
            }

            if (parse_url($value) === false) {
                throw new Exception("URL '$value' seems to be not a valid URL");
            }

            // TODO should we check if URL exists and is valid?!? might not work if instance is not connected to internet
        };
        $this->customPiwikSiteUrl->transform = function ($value) {
            if (empty($value)) {
                return $value;
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
        $this->customPiwikSiteId->validate = function ($idSite) {
            if (empty($idSite)) {
                return;
            }

            if (!is_numeric($idSite)) {
                throw new Exception("Site Id '$idSite' should be a number");
            }

            $idSite = (int) $idSite;
            $siteExists = Request::processRequest('SitesManager.getSiteFromId', array('idSite' => $idSite));

            if (!$siteExists) {
                throw new Exception("The specified idSite '$idSite' does not exist");
            }
        };

        $this->addSetting($this->customPiwikSiteId);
    }

}
