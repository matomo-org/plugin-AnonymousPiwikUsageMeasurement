<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\Common;
use Piwik\Piwik;
use Piwik\SettingsPiwik;
use Piwik\Version;
use Piwik\View;

class AnonymousPiwikUsageMeasurement extends \Piwik\Plugin
{

    /**
     * @see Piwik\Plugin::registerEvents
     */
    public function registerEvents()
    {
        return array(
            'AssetManager.getJavaScriptFiles' => 'getJsFiles',
            'Template.jsGlobalVariables' => 'addPiwikTracking',
        );
    }

    public function getJsFiles(&$jsFiles)
    {
        $jsFiles[] = 'js/piwik.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/javascripts/url.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/javascripts/tracking.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/angularjs/common/dashboard.directive.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/angularjs/common/marketplace.directive.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/angularjs/common/segment.directive.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/angularjs/common/emailreports.directive.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/angularjs/common/multisites.directive.js';
    }

    public function addPiwikTracking(&$out)
    {
        $settings = new Settings();

        if (!$settings->userTrackingEnabled->getValue()) {
            return;
        }

        if (Piwik::hasUserSuperUserAccess()) {
            $role = 'superuser';
        } elseif (Piwik::isUserIsAnonymous()) {
            $role = 'anonymous';
        } else {
            // I do not check between view/admin as it could trigger slow DB queries to fetch sites with access
            $role = 'user';
        }

        $tracking = array(
            'targets' => array(),
            'visitorCustomVariables' => array(
                array(
                    'id' => 1,
                    'name' => 'Piwik Version',
                    'value' => Version::VERSION,
                ),
                array(
                    'id' => 2,
                    'name' => 'PHP Version',
                    'value' => phpversion(),
                ),
                array(
                    'id' => 3,
                    'name' => 'Role',
                    'value' => $role,
                )
            )
        );

        if ($settings->trackToPiwik->getValue()) {
            $tracking['targets'][] = array(
                'url' => 'http://demo.piwik.org/piwik.php',
                'idSite' => 51,
                'cookieDomain' => '*.piwik.org'
            );
        }

        $ownSiteId = $settings->ownPiwikSiteId->getValue();
        if ($ownSiteId) {
            $piwikUrl = SettingsPiwik::getPiwikUrl();
            if (!Common::stringEndsWith($piwikUrl, '/')) {
                $piwikUrl .= '/';
            }
            $tracking['targets'][] = array(
                'url' => $piwikUrl . 'piwik.php',
                'idSite' => (int) $ownSiteId,
                'cookieDomain' => ''
            );
        }

        $customUrl = $settings->customPiwikSiteUrl->getValue();
        $customSiteId = $settings->customPiwikSiteId->getValue();
        if ($customUrl && $customSiteId) {
            $tracking['targets'][] = array(
                'url' => $customUrl,
                'idSite' => (int) $customSiteId,
                'cookieDomain' => ''
            );
        }

        $out .= "\nvar piwikUsageTracking = " . json_encode($tracking) . ";\n";
    }

}
