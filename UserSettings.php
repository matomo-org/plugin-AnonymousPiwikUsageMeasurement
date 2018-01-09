<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\Settings\Setting;
use Piwik\Settings\FieldConfig;

/**
 * Defines Settings for AnonymousPiwikUsageMeasurement.
 */
class UserSettings extends \Piwik\Settings\Plugin\UserSettings
{
    /** @var Setting */
    public $canUserOptOut;

    /** @var Setting */
    public $userTrackingEnabled;

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

    /**
     * @var SystemSettings
     */
    private $systemSettings;

    public function __construct(SystemSettings $systemSettings)
    {
        $this->systemSettings = $systemSettings;
        parent::__construct();
    }

    protected function init()
    {
        $this->userTrackingEnabled = $this->createUsersOptOutSetting();

        if (!$this->systemSettings->canUserOptOut->getValue()) {
            // we show this setting only when a user can actually opt out
            $this->userTrackingEnabled->setIsWritableByCurrentUser(false);
        }
    }

    private function createUsersOptOutSetting()
    {
        return $this->makeSetting('userTrackingEnabled', $default = true, FieldConfig::TYPE_BOOL, function (FieldConfig $field) {
            $field->title = 'Matomo usage tracking enabled';
            $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
            $field->description = 'If enabled, anonymous usage data will be tracked. For example which pages are viewed and which reports are used most often. For more information contact your system administrator.';
        });
    }

}
