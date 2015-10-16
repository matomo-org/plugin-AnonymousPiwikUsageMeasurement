<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration\Tracker;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Profiles;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group Profiles
 * @group ProfilesTest
 * @group Plugins
 */
class ProfilesTest extends IntegrationTestCase
{
    /**
     * @var Profiles
     */
    private $profiles;

    public function setUp()
    {
        parent::setUp();

        $this->profiles = new Profiles();
    }

    public function test_popAll_ShouldReturnNoProfiles_WhenNothingPushed()
    {
        $this->assertSame(array(), $this->profiles->popAll());
    }

    public function test_pushEvent_ShouldAddProfileToListOfExistingProfiles()
    {
        $this->pushProfile('2014-01-01 00:01:02');
        $this->assertEquals(array(array(
            'creation_date' => '2014-01-01 00:01:02',
            'category' => 'Category',
            'name' => 'myName',
            'action' => 'myAction',
            'count' => '1',
            'wall_time' => '35',
        )), $this->profiles->popAll());
    }

    public function test_pushEvent_ShouldAggregateValue_WhenPushingSameEventMultipleTimes()
    {
        $this->pushProfile('2014-01-01 00:01:02');
        $this->pushProfile('2014-01-01 00:01:03');
        $this->pushProfile('2014-01-01 00:01:04');
        $this->assertEquals(array(array(
            'creation_date' => '2014-01-01 00:01:02',
            'category' => 'Category',
            'name' => 'myName',
            'action' => 'myAction',
            'count' => '3',
            'wall_time' => '105',
        )), $this->profiles->popAll());
    }

    public function test_pushEvent_ShouldPushAndReturnDifferentProfiles()
    {
        $this->pushProfile('2014-01-01 00:01:02');
        $this->pushProfile('2014-01-01 00:01:03', 'OtherCategory');
        $this->pushProfile('2014-01-01 00:01:04', 'Category', 'otherName');
        $this->pushProfile('2014-01-01 00:01:05', 'Category', 'myName', 'otherAction');
        $this->pushProfile('2014-01-01 00:01:06', 'Category', 'myName', 'lastAction', 10, 202);
        $this->pushProfile('2014-01-01 00:01:07', 'Category', 'myName', 'lastAction', 1, $wallTime = 71);
        $this->pushProfile('2014-01-01 00:01:08');

        $expected = array(
            array(
                'creation_date' => '2014-01-01 00:01:06',
                'category' => 'Category',
                'name' => 'myName',
                'action' => 'lastAction',
                'count' => '11',
                'wall_time' => '273',
            ),
            array(
                'creation_date' => '2014-01-01 00:01:02',
                'category' => 'Category',
                'name' => 'myName',
                'action' => 'myAction',
                'count' => '2', // we tracked same profile twice
                'wall_time' => '70',
            ),
            array(
                'creation_date' => '2014-01-01 00:01:05',
                'category' => 'Category',
                'name' => 'myName',
                'action' => 'otherAction',
                'count' => '1',
                'wall_time' => '35',
            ),
            array(
                'creation_date' => '2014-01-01 00:01:04',
                'category' => 'Category',
                'name' => 'otherName',
                'action' => 'myAction',
                'count' => '1',
                'wall_time' => '35',
            ),
            array(
                'creation_date' => '2014-01-01 00:01:03',
                'category' => 'OtherCategory',
                'name' => 'myName',
                'action' => 'myAction',
                'count' => '1',
                'wall_time' => '35',
            )
        );

        $this->assertEquals($expected, $this->profiles->popAll());
    }

    public function test_popAll_shouldRemoveAllProfiles()
    {
        $this->pushProfile('2014-01-01 00:01:02');
        $this->pushProfile('2014-01-01 00:01:03', 'OtherCategory');
        $this->pushProfile('2014-01-01 00:01:04', 'Category', 'otherName');

        $this->assertCount(3, $this->profiles->popAll());

        $this->assertSame(array(), $this->profiles->popAll());
    }

    private function pushProfile($creationDate, $category = 'Category', $name = 'myName', $action = 'myAction', $count = 1, $wallTime = '35')
    {
        $this->profiles->pushProfile($creationDate, $category, $name, $action, $count, $wallTime);
    }


}
