<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\System;

use Piwik\DataTable;
use Piwik\Piwik;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Fixtures\SendSystemReportTaskFixture;
use Piwik\Tests\Framework\TestCase\SystemTestCase;
use Piwik\Version;

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

    public function setUp(): void
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
                $value->setColumn('min_event_value', '2');
                $value->setColumn('sum_daily_nb_uniq_visitors', '2');
                $value->setColumn('avg_event_value', '2');

                if ($value->isSubtableLoaded()) {
                    $subtable = $value->getSubtable();
                    foreach ($subtable->getRows() as $row) {
                        $row->setColumn('sum_event_value', '2');
                        $row->setColumn('max_event_value', '2');
                        $row->setColumn('min_event_value', '2');
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
        $apis = [
            'API.get',
            'Actions.getPageUrls',
            'Actions.getPageTitles',
            'Events',
            'Referrers.getReferrerType',
            'CustomVariables',
        ];

        $xmlFieldsToRemove = [];

        if (version_compare(Version::VERSION, '5.5.0-b1', '<')) {
            $xmlFieldsToRemove = ['Referrers_visitorsFromAIAssistants', 'Referrers_distinctAIAssistants', 'Referrers_visitorsFromAIAssistants_percent'];
        }

        if (version_compare(Version::VERSION, '5.6.0-alpha', '<')) {
            // In Matomo 5.6 AI agent information had been added
            $xmlFieldsToRemove = array_merge($xmlFieldsToRemove, [
                'nb_visits_ai_agent',
                'nb_actions_ai_agent',
                'nb_uniq_visitors_ai_agent',
                'nb_users_ai_agent',
                'max_actions_ai_agent',
                'bounce_rate_ai_agent',
                'nb_actions_per_visit_ai_agent',
                'avg_time_on_site_ai_agent',
                'nb_visits_human',
                'nb_actions_human',
                'nb_uniq_visitors_human',
                'nb_users_human',
                'max_actions_human',
                'bounce_rate_human',
                'nb_actions_per_visit_human',
                'avg_time_on_site_human',
            ]);
        }

        $apiToTest   = [];
        foreach ($apis as $api) {
            $apiToTest[] = [
                $api,
                [
                    'idSite'     => 1,
                    'date'       => 'today',
                    'periods'    => ['year'],
                    'otherRequestParameters' => [
                        'hideColumns' => 'hits,sum_visit_length,entry_sum_visit_length,avg_time_on_site_new,sum_bandwidth,nb_hits_with_bandwidth,min_bandwidth,max_bandwidth,avg_bandwidth,nb_total_overall_bandwidth,nb_total_pageview_bandwidth,nb_total_download_bandwidth',
                    ],

                    // when calling CustomVariables.getUsagesOfSlots, new archives are created until 'today',
                    // which increments idsubdatatable, but we need to have deterministic idsubdatatable
                    'apiNotToCall' => ['CustomVariables.getUsagesOfSlots'],
                    'xmlFieldsToRemove' => $xmlFieldsToRemove,
                ]
            ];
        }

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
