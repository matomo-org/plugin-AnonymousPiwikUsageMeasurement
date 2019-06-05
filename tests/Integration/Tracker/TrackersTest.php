<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration\Tracker;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Trackers;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

class TestTargets extends Tracker\Targets {

    private $targets = array();

    public function __construct($targets)
    {
        $this->targets = $targets;
    }

    public function getTargets()
    {
        return $this->targets;
    }

}

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group Trackers
 * @group TrackersTest
 * @group Plugins
 */
class TrackersTest extends IntegrationTestCase
{
    /**
     * All your actual test methods should start with the name "test"
     */
    public function test_makeTrackers_NoTrackersGiven()
    {
        $targets  = new TestTargets(array());
        $trackers = new Trackers($targets);
        $trackers = $trackers->makeTrackers();

        $this->assertSame(array(), $trackers);
    }

    /**
     * All your actual test methods should start with the name "test"
     */
    public function test_makeTrackers_FromDefaultSettings()
    {
        $settings = new SystemSettings();
        $targets  = new Tracker\Targets($settings);
        $trackers = new Trackers($targets);
        $trackers = $trackers->makeTrackers();

        $this->assertCount(0, $trackers);
    }

    /**
     * All your actual test methods should start with the name "test"
     */
    public function test_makeTrackers_CanCreateMultipleTrackers_AndSavesUrlAndIdSiteCorrectInTheInstance_AndAnonymizesUrlAndReferrer()
    {
        $targets = array(
            array('url' => 'http://apache.piwik/piwik.php', 'idSite' => 98, 'useAnonymization' => true),
            array('url' => 'http://apache.piwik/piwik/piwik.php', 'idSite' => 101, 'useAnonymization' => true),
        );

        $targets  = new TestTargets($targets);
        $trackers = new Trackers($targets);
        $trackers = $trackers->makeTrackers();

        $this->assertCount(2, $trackers);

        // verify url anonymized, referrer removed, idSite + url applied
        $this->assertStringStartsWith('http://apache.piwik/piwik.php?idsite=98&rec=1', $trackers[0]->getUrlTrackPageView());
        $this->assertStringEndsWith('url=http%3A%2F%2Fdemo-anonymous.matomo.org&urlref=', $trackers[0]->getUrlTrackPageView());

        $this->assertStringStartsWith('http://apache.piwik/piwik/piwik.php?idsite=101&rec=1', $trackers[1]->getUrlTrackPageView());
        $this->assertStringEndsWith('url=http%3A%2F%2Fdemo-anonymous.matomo.org&urlref=', $trackers[1]->getUrlTrackPageView());
    }

}
