<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\System;

use Piwik\Piwik;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Fixtures\SendSystemReportTaskFixture;
use Piwik\Tests\Framework\TestCase\SystemTestCase;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group TasksTest
 * @group Plugins
 */
class TasksTest extends SystemTestCase
{
    /**
     * @var SendSystemReportTaskFixture
     */
    public static $fixture = null; // initialized below class definition

    public function setUp()
    {
        parent::setUp();

        $self = $this;
        Piwik::addAction('API.Live.getLastVisitsDetails.end', function (&$return, $params) use ($self) {
            // we make sure processed result is the same at any time
            foreach ($return as &$value) {
                $value->setColumn('visit_last_action_time', '2015-10-12 17:31:45');
                $value->setColumn('visit_first_action_time', '2015-10-12 17:31:45');
                $value->setColumn('visitor_localtime', '17:31:45');
            }
        });
    }

    /**
     * @dataProvider getApiForTesting
     */
    public function testApi($api, $params)
    {
        $this->runApiTests($api, $params);
    }

    public function getApiForTesting()
    {
        $api = array(
            'API.get',
            'Actions.getPageUrls',
            'Actions.getPageTitles',
            'Events',
            'Referrers.getReferrerType',
            'CustomVariables',
            'Live.getLastVisitsDetails'
        );

        $apiToTest   = array();
        $apiToTest[] = array($api,
            array(
                'idSite'     => 1,
                'date'       => 'today',
                'periods'    => array('year'),
                'testSuffix' => ''
            )
        );

        return $apiToTest;
    }

    public static function getOutputPrefix()
    {
        return '';
    }

    public static function getPathToTestDirectory()
    {
        return dirname(__FILE__);
    }

}

TasksTest::$fixture = new SendSystemReportTaskFixture();