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
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Profiles;
use Piwik\View;

class AnonymousPiwikUsageMeasurement extends \Piwik\Plugin
{
    const TRACKING_DOMAIN = 'http://demo-anonymous.matomo.org';
    const EXAMPLE_DOMAIN = 'http://example.com';

    private $profilingStack = array();

    /**
     * @see \Piwik\Plugin::registerEvents
     */
    public function registerEvents()
    {
        return array(
            'AssetManager.getJavaScriptFiles' => 'getJsFiles',
            'Template.jsGlobalVariables' => 'addPiwikClientTracking',
            'API.Request.dispatch' => 'logStartTimeOfApiCall',
            'API.Request.dispatch.end' => 'trackApiCall',
        );
    }

    public function install()
    {
        $dao = new Profiles();
        $dao->install();
    }

    public function uninstall()
    {
        $dao = new Profiles();
        $dao->uninstall();
    }

    public function logStartTimeOfApiCall(&$finalParameters, $pluginName, $methodName)
    {
        // API methods can call other API methods...
        $this->profilingStack[] = array(
            'method' => $pluginName . '.' . $methodName,
            'time' => microtime(true)
        );
    }

    public function trackApiCall(&$return, $endHookParams)
    {
        $endTime = microtime(true);

        $name = $endHookParams['module'];
        $method = $name . '.' . $endHookParams['action'];
        $neededTimeInMs = 0;

        do {
            $call = array_pop($this->profilingStack);

            // we need to make sure the call was actually for this method to not send wrong data.
            if ($method === $call['method']) {

                $neededTimeInMs = ceil(($endTime - $call['time']) * 1000);
                break;
            }

        } while (!empty($this->profilingStack));

        if (empty($neededTimeInMs)) {
            return;
        }

        $profiles = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Profiles');

        $now = Date::now()->getDatetime();
        $category = 'API';

        $profiles->pushProfile($now, $category, $name, $method, $count = 1, (int) $neededTimeInMs);
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
        $settings = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings');
        $userSettings = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\UserSettings');

        $config = array(
            'targets' => array(),
            'visitorCustomVariables' => array(),
            'trackingDomain' => self::TRACKING_DOMAIN,
            'exampleDomain' => self::EXAMPLE_DOMAIN,
            'userId' => Piwik::getCurrentUserLogin()
        );

        if (Piwik::isUserIsAnonymous()
            || !$settings->canUserOptOut->getValue()
            || $userSettings->userTrackingEnabled->getValue()) {
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
