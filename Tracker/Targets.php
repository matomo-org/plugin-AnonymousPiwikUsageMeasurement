<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;

use Piwik\Common;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;
use Piwik\SettingsPiwik;
use Piwik\Tests\Framework\Fixture;

/**
 * Defines Settings for AnonymousPiwikUsageMeasurement.
 */
class Targets
{
    /**
     * @var SystemSettings
     */
    private $settings;

    public function __construct(SystemSettings $settings)
    {
        $this->settings = $settings;
    }

    public function getTargets()
    {
        $targets = array();

        if ($this->settings->trackToPiwik->getValue()) {
            $targets[] = array(
                'url' => 'https://demo-anonymous.matomo.org/piwik.php',
                'idSite' => 1,
                'useAnonymization' => true
            );
        }

        $ownSiteId = $this->settings->ownPiwikSiteId->getValue();
        if ($ownSiteId) {
            $piwikUrl = SettingsPiwik::getPiwikUrl();
            if (!Common::stringEndsWith($piwikUrl, '/')) {
                $piwikUrl .= '/';
            }
            $targets[] = array(
                'url' => $piwikUrl . 'piwik.php',
                'idSite' => (int) $ownSiteId,
                'useAnonymization' => $this->settings->anonymizeSelfPiwik->getValue()
            );
        }

        $customUrl = $this->settings->customPiwikSiteUrl->getValue();
        $customSiteId = $this->settings->customPiwikSiteId->getValue();
        if ($customUrl && $customSiteId) {
            $targets[] = array(
                'url' => $customUrl,
                'idSite' => (int) $customSiteId,
                'useAnonymization' => $this->settings->anonymizeCustomPiwik->getValue()
            );
        }

        if (defined('PIWIK_TEST_MODE') && PIWIK_TEST_MODE && Common::isPhpCliMode()) {
            foreach ($targets as &$target) {
                $target['token_auth'] = Fixture::getTokenAuth();
            }
        }

        return $targets;
    }

}
