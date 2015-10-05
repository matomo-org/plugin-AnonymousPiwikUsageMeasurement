<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

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
        $jsFiles[] = 'piwik.js';
        $jsFiles[] = 'plugins/AnonymousPiwikUsageMeasurement/javascripts/tracking.js';
    }

    public function addPiwikTracking(&$out)
    {
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
                )
            )
        );

        $settings = new Settings();
        if ($settings->trackToPiwik->getValue()) {
            $tracking['targets'][] = array(
                'url' => 'http://demo.piwik.org/piwik.php',
                'idSite' => 51,
                'cookieDomain' => '*.piwik.org'
            );
        }

        $ownSiteId = $settings->ownPiwikSiteId->getValue();
        if ($ownSiteId) {
            $tracking['targets'][] = array(
                'url' => 'piwik.php',
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
