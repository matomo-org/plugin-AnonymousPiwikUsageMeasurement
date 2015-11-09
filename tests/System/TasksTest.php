<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\System;

use Piwik\DataTable;
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
        Piwik::addAction('API.Request.dispatch.end', function (&$return, $extra) use ($self) {
            if ($extra['module'] !== 'Events') {
                return;
            }

            /** @var DataTable $return*/

            // we make sure processed result is the same at any time
            foreach ($return as &$value) {
                $value->setColumn('sum_event_value', '2');
                $value->setColumn('max_event_value', '2');
                $value->setColumn('sum_daily_nb_uniq_visitors', '2');
                $value->setColumn('avg_event_value', '2');

                if ($value->isSubtableLoaded()) {
                    $subtable = $value->getSubtable();
                    foreach ($subtable->getRows() as $row) {
                        $row->setColumn('sum_event_value', '2');
                        $row->setColumn('max_event_value', '2');
                        $row->setColumn('sum_daily_nb_uniq_visitors', '2');
                        $row->setColumn('avg_event_value', '2');
                    }
                }
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
        );

        $apiToTest   = array();
        $apiToTest[] = array($api,
            array(
                'idSite'     => 1,
                'date'       => '2013-01-23',
                'periods'    => array('year'),
                'testSuffix' => '',
                'apiNotToCall' => array('CustomVariables.getUsagesOfSlots'),
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
