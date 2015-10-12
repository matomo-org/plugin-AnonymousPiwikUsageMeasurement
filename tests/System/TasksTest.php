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
        Piwik::addAction('API.Request.dispatch.end', function (&$return, $params) use ($self) {
            // we make sure processed result is the same independent on the Piwik include path
            TasksTest::replacePiwikAndPhpVersion($return, $params);
        });
    }

    private static function replacePiwikPath($path)
    {
        return str_replace(PIWIK_INCLUDE_PATH, '/home/test/dir', $path);
    }

    public static function replacePiwikAndPhpVersion(&$return, $params)
    {
        if ($params['module'] === 'AutoLogImporter') {
            if ($params['action'] === 'getFilesThatCanBeImported') {
                foreach ($return as &$value) {
                    $value = self::replacePiwikPath($value);
                }
            } elseif ($params['action'] === 'getFilesHavingInvalidHash') {
                foreach ($return as &$row) {
                    if (!empty($row['file'])) {
                        $row['file'] = self::replacePiwikPath($row['file']);
                    }
                    if (!empty($row['verify_file'])) {
                        $row['verify_file'] = self::replacePiwikPath($row['verify_file']);
                    }
                }
            }
        }
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