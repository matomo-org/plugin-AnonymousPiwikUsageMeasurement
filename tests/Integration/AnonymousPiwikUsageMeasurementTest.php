<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration;

use Piwik\API\Request;
use Piwik\Container\StaticContainer;
use Piwik\Piwik;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Settings;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Events;
use Piwik\Tests\Framework\Mock\FakeAccess;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group AnonymousPiwikUsageMeasurementTest
 * @group Plugins
 */
class AnonymousPiwikUsageMeasurementTest extends IntegrationTestCase
{
    public function test_shouldTrackApiCall()
    {
        Request::processRequest('API.getPiwikVersion');
        Request::processRequest('API.getSettings');
        Request::processRequest('UsersManager.getUsers');
        Request::processRequest('API.getPiwikVersion');

        $events = new Events();
        $pushedEvents = $events->popAll();

        foreach ($pushedEvents as &$pushedEvent) {
            $this->assertNotEmpty($pushedEvent['creation_date']);
            unset($pushedEvent['creation_date']);
        }

        $expected = array(
            array (
                'event_category' => 'API',
                'event_name' => 'API',
                'event_action' => 'getPiwikVersion',
                'event_value' => '2',
            ),
            array (
                'event_category' => 'API',
                'event_name' => 'API',
                'event_action' => 'getSettings',
                'event_value' => '1',
            ),
            array (
                'event_category' => 'API',
                'event_name' => 'UsersManager',
                'event_action' => 'getUsers',
                'event_value' => '1',
            )
        );

        $this->assertEquals($expected, $pushedEvents);
    }

    public function test_shouldNotAddTargetsOrCustomVariables_IfDisabledByUser()
    {
        $settings = $this->makePluginSettings();
        $settings->userTrackingEnabled->setValue(false);

        $out = '';
        Piwik::postEvent('Template.jsGlobalVariables', array(&$out));

        $this->assertContains('var piwikUsageTracking = {"targets":[],"visitorCustomVariables":[],', $out);
    }

    public function test_shouldAddTrackingCallsWithTargetsAndCustomVariables_IfEnabledByUser()
    {
        $settings = $this->makePluginSettings();
        $settings->userTrackingEnabled->setValue(true);

        $out = '';
        Piwik::postEvent('Template.jsGlobalVariables', array(&$out));
        $this->assertContains('var piwikUsageTracking = {"targets":[{"url":"http:\/\/demo.piwik.org\/piwik.php","idSite":51,"cookieDomain":"*.piwik.org"}],"visitorCustomVariables":[{"id":1,"name":"Access","value":"superuser"}],"trackingDomain":"http:\/\/demo.piwik.org","exampleDomain":"http:\/\/example.com"}', $out);
    }

    public function test_shouldAlwaysAddTrackingCallAndNotFail_IfUserIsAnonmyous()
    {
        $this->makePluginSettings();
        FakeAccess::clearAccess($superUser = false, array(), array(), $login = 'anonymous');

        $out = '';
        Piwik::postEvent('Template.jsGlobalVariables', array(&$out));
        $this->assertContains('var piwikUsageTracking = {"targets":[{"url"', $out);
        $this->assertContains('{"id":1,"name":"Access","value":"anonymous"}', $out);
    }

    private function makePluginSettings()
    {
        $settings = new Settings();
        StaticContainer::getContainer()->set('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Settings', $settings);
        return $settings;
    }

    public function provideContainerConfig()
    {
        return array(
            'Piwik\Access' => new FakeAccess()
        );
    }

}
