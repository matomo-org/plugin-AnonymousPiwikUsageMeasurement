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
use Exception;
use Piwik\Settings\Setting;
use Piwik\Settings\FieldConfig;
use Piwik\UrlHelper;

/**
 * Defines Settings for AnonymousPiwikUsageMeasurement.
 */
class SystemSettings extends \Piwik\Settings\Plugin\SystemSettings
{
    /** @var Setting */
    public $canUserOptOut;

    /** @var Setting */
    public $trackToPiwik;

    /** @var Setting */
    public $ownPiwikSiteId;

    /** @var Setting */
    public $customPiwikSiteId;

    /** @var Setting */
    public $customPiwikSiteUrl;

    /** @var Setting */
    public $anonymizeCustomPiwik;

    /** @var Setting */
    public $anonymizeSelfPiwik;

    protected function init()
    {
        $this->canUserOptOut = $this->createLetUsersOptOutSetting();
        $this->trackToPiwik = $this->createTrackToPiwikSetting();

        $this->ownPiwikSiteId = $this->createTrackToOwnPiwikSetting();
        $this->anonymizeSelfPiwik = $this->anonymizationOption('anonymizeSelfPiwik');

        $this->customPiwikSiteUrl = $this->createTrackToCustomSiteUrlSetting();
        $this->customPiwikSiteId = $this->createTrackToCustomSiteIdSetting();

        $this->anonymizeCustomPiwik = $this->anonymizationOption('anonymizeCustomPiwik');
    }

    private function createLetUsersOptOutSetting()
    {
        return $this->makeSetting('canUserOptOut', $default = true, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = 'Let users disable anonymous tracking';
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->description = 'If enabled, logged in users can opt out in their plugin settings. Anonymous users cannot opt out.';
        });
    }

    private function createTrackToPiwikSetting()
    {
        return $this->makeSetting('trackToPiwik', $default = true, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = 'Send usage data to Matomo.org';
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->introduction = 'Send anonmyized usage data to the creators of Matomo';
            $field->description = 'If enabled, anonymized usage data will be sent to demo-anonymous.matomo.org and the tracked data can be viewed there (the data is public). The collected data is used to improve Matomo. Thank you for making Matomo better!';
        });
    }

    private function createTrackToOwnPiwikSetting()
    {
        return $this->makeSetting('ownPiwikSiteId', $default = 0, FieldConfig::TYPE_INT, function (FieldConfig $field) {
            $field->title = 'Site Id';
            // ideally we would use a SELECT control and let user choose an existing site but this would make performance slow
            // since we'd always have to get all site ids in each request
            $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
            $field->introduction = 'Send usage data to this Matomo';
            $field->description = 'If specified, anonymized usage data will be sent to the specified site in this Matomo. This lets you analyze how you and your colleagues are using Matomo.';
            $field->validate = function ($idSite) {
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
        });
    }

    private function createTrackToCustomSiteUrlSetting()
    {
        return $this->makeSetting('customSiteUrl', $default = '', FieldConfig::TYPE_STRING, function (FieldConfig $field) {
            $field->title = 'Matomo Url';
            $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
            $field->uiControlAttributes = array('placeHolder' => 'eg. http://example.com/matomo');
            $field->introduction = 'Send usage data to a custom Matomo';
            $field->description = '';
            $field->validate = function ($value, $setting) {
                if (empty($value)) {
                    return;
                }

                if (!UrlHelper::isLookLikeUrl($value)) {
                    throw new Exception("URL '$value' seems to be not a valid URL");
                }

                // TODO should we check if URL exists and is valid?!? might not work if instance is not connected to internet
            };
            $field->transform = function ($value) {
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
        });
    }

    private function createTrackToCustomSiteIdSetting()
    {
        return $this->makeSetting('customSiteId', $default = 0, FieldConfig::TYPE_INT, function (FieldConfig $field) {
            $field->title = 'Site Id';
            $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
            $field->uiControlAttributes = array('placeHolder' => 'eg. "2"');
            $field->description = 'If a URL and Site Id is specified, usage data will be sent to the custom Matomo instance.';
            $field->validate = function ($idSite) {
                if (empty($idSite)) {
                    return;
                }

                if (!is_numeric($idSite)) {
                    throw new Exception("Site Id '$idSite' should be a number");
                }
            };
        });
    }

    private function anonymizationOption($optionName)
    {
        return $this->makeSetting($optionName, $default = true, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = 'Anonymize tracking requests';
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
        });
    }
}
