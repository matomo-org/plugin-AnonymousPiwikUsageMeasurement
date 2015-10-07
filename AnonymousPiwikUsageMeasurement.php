<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\Container\StaticContainer;
use Piwik\Date;
use Piwik\Log;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Events;
use Piwik\View;

class AnonymousPiwikUsageMeasurement extends \Piwik\Plugin
{
    const TRACKING_DOMAIN = 'http://demo.piwik.org';
    const EXAMPLE_DOMAIN = 'http://example.com';

    /**
     * @see Piwik\Plugin::registerEvents
     */
    public function registerEvents()
    {
        return array(
            'AssetManager.getJavaScriptFiles' => 'getJsFiles',
            'Template.jsGlobalVariables' => 'addPiwikClientTracking',
            'API.Request.dispatch' => 'trackApiCall',
        );
    }

    public function install()
    {
        $dao = new Events();
        $dao->install();
    }

    public function uninstall()
    {
        $dao = new Events();
        $dao->uninstall();
    }

    public function trackApiCall(&$finalParameters, $pluginName, $methodName)
    {
        $eventTracker = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Events');

        $now = Date::now()->getDatetime();
        $category = 'API';
        $name = $pluginName;
        $action = $methodName;
        $value = 1;

        $eventTracker->pushEvent($now, $category, $name, $action, $value);
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

    public function addPiwikClientTracking(&$out)
    {
        $settings = new Settings();

        if (!$settings->userTrackingEnabled->getValue()) {
            return;
        }

        $targets = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Targets');
        $customVars = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\CustomVariables');

        $config = array(
            'targets' => $targets->getTargets(),
            'visitorCustomVariables' => $customVars->getClientVisitCustomVariables(),
            'trackingDomain' => self::TRACKING_DOMAIN,
            'exampleDomain' => self::EXAMPLE_DOMAIN
        );

        $out .= "\nvar piwikUsageTracking = " . json_encode($config) . ";\n";
    }

}
