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
use Piwik\Piwik;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Events;
use Piwik\View;

class AnonymousPiwikUsageMeasurement extends \Piwik\Plugin
{
    const TRACKING_DOMAIN = 'http://demo-anonymous.piwik.org';
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
        $jsFiles[] = 'piwik.js';
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
        $settings = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Settings');

        $config = array(
            'targets' => array(),
            'visitorCustomVariables' => array(),
            'trackingDomain' => self::TRACKING_DOMAIN,
            'exampleDomain' => self::EXAMPLE_DOMAIN
        );

        if (Piwik::isUserIsAnonymous()
            || !$settings->userTrackingEnabled->isReadableByCurrentUser()
            || $settings->userTrackingEnabled->getValue()) {
            // an anonymous user is currently always tracked, an anonymous user would not have permission to read
            // this user setting. The `isUserIsAnonymous()` check is not needed but there to improve performance
            // in case user is anonymous. Then we avoid checking whether user has access to any sites which can be slow
            // a user not having any view permission is also always tracked so far as such a user is not allowed to read
            // this setting
            $targets = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Targets');
            $customVars = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\CustomVariables');

            $config['targets'] = $targets->getTargets();
            $config['visitorCustomVariables'] = $customVars->getClientVisitCustomVariables();
        }

        $out .= "\nvar piwikUsageTracking = " . json_encode($config) . ";\n";
    }

}
