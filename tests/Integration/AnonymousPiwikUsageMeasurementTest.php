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
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Profiles;
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

        $profiles = new Profiles();
        $pushedProfiles = $profiles->popAll();

        foreach ($pushedProfiles as &$pushedProfile) {
            $this->assertNotEmpty($pushedProfile['creation_date']);
            unset($pushedProfile['creation_date']);

            $this->assertGreaterThanOrEqual(1, $pushedProfile['wall_time']);
            unset($pushedProfile['wall_time']);
        }

        $expected = array(
            array (
                'category' => 'API',
                'name' => 'API',
                'action' => 'API.getPiwikVersion',
                'count' => '2',
            ),
            array (
                'category' => 'API',
                'name' => 'API',
                'action' => 'API.getSettings',
                'count' => '1',
            ),
            array (
                'category' => 'API',
                'name' => 'UsersManager',
                'action' => 'UsersManager.getUsers',
                'count' => '1',
            )
        );

        $this->assertEquals($expected, $pushedProfiles);
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
        $this->assertContains('var piwikUsageTracking = {"targets":[{"url":"http:\/\/demo-anonymous.piwik.org\/piwik.php","idSite":1,"useAnonymization":true}],"visitorCustomVariables":[{"id":1,"name":"Access","value":"superuser"}],"trackingDomain":"http:\/\/demo-anonymous.piwik.org","exampleDomain":"http:\/\/example.com"}', $out);
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

    public function test_shouldAddTrackingCallsWithoutTargetsAndCustomVariables_IfOptOutIsDisabled()
    {
        $settings = $this->makePluginSettings();
        $settings->canUserOptOut->setValue(false);
        $settings->save();

        // we need to save it first and create new settings instance since the setting will be missing afterwards.
        $this->makePluginSettings();

        $out = '';
        Piwik::postEvent('Template.jsGlobalVariables', array(&$out));
        $this->assertContains('var piwikUsageTracking = {"targets":[{"url":"http:\/\/demo-anonymous.piwik.org\/piwik.php","idSite":1,"useAnonymization":true}],"visitorCustomVariables":[{"id":1,"name":"Access","value":"superuser"}],"trackingDomain":"http:\/\/demo-anonymous.piwik.org","exampleDomain":"http:\/\/example.com"}', $out);
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
