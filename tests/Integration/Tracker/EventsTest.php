<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration\Tracker;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Events;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group Events
 * @group EventsTest
 * @group Plugins
 */
class EventsTest extends IntegrationTestCase
{
    /**
     * @var Events
     */
    private $events;

    public function setUp()
    {
        parent::setUp();

        $this->events = new Events();
    }

    public function test_popAll_ShouldReturnNoEvents_WhenNothingPushed()
    {
        $this->assertSame(array(), $this->events->popAll());
    }

    public function test_pushEvent_ShouldAddEventToListOfExistingEvents()
    {
        $this->pushEvent('2014-01-01 00:01:02');
        $this->assertEquals(array(array(
            'creation_date' => '2014-01-01 00:01:02',
            'event_category' => 'Category',
            'event_name' => 'myName',
            'event_action' => 'myAction',
            'event_value' => '1',
        )), $this->events->popAll());
    }

    public function test_pushEvent_ShouldAggregateValue_WhenPushingSameEventMultipleTimes()
    {
        $this->pushEvent('2014-01-01 00:01:02');
        $this->pushEvent('2014-01-01 00:01:03');
        $this->pushEvent('2014-01-01 00:01:04');
        $this->assertEquals(array(array(
            'creation_date' => '2014-01-01 00:01:02',
            'event_category' => 'Category',
            'event_name' => 'myName',
            'event_action' => 'myAction',
            'event_value' => '3',
        )), $this->events->popAll());
    }

    public function test_pushEvent_ShouldPushAndReturnDifferentEvents()
    {
        $this->pushEvent('2014-01-01 00:01:02');
        $this->pushEvent('2014-01-01 00:01:03', 'OtherCategory');
        $this->pushEvent('2014-01-01 00:01:04', 'Category', 'otherName');
        $this->pushEvent('2014-01-01 00:01:05', 'Category', 'myName', 'otherAction');
        $this->pushEvent('2014-01-01 00:01:06', 'Category', 'myName', 'lastAction', 10);
        $this->pushEvent('2014-01-01 00:01:07');

        $expected = array(
            array(
                'creation_date' => '2014-01-01 00:01:06',
                'event_category' => 'Category',
                'event_name' => 'myName',
                'event_action' => 'lastAction',
                'event_value' => '10',
            ),
            array(
                'creation_date' => '2014-01-01 00:01:02',
                'event_category' => 'Category',
                'event_name' => 'myName',
                'event_action' => 'myAction',
                'event_value' => '2', // we tracked same event twice
            ),
            array(
                'creation_date' => '2014-01-01 00:01:05',
                'event_category' => 'Category',
                'event_name' => 'myName',
                'event_action' => 'otherAction',
                'event_value' => '1',
            ),
            array(
                'creation_date' => '2014-01-01 00:01:04',
                'event_category' => 'Category',
                'event_name' => 'otherName',
                'event_action' => 'myAction',
                'event_value' => '1',
            ),
            array(
                'creation_date' => '2014-01-01 00:01:03',
                'event_category' => 'OtherCategory',
                'event_name' => 'myName',
                'event_action' => 'myAction',
                'event_value' => '1',
            )
        );

        $this->assertEquals($expected, $this->events->popAll());
    }

    public function test_popAll_shouldRemoveAllEvents()
    {
        $this->pushEvent('2014-01-01 00:01:02');
        $this->pushEvent('2014-01-01 00:01:03', 'OtherCategory');
        $this->pushEvent('2014-01-01 00:01:04', 'Category', 'otherName');

        $this->assertCount(3, $this->events->popAll());

        $this->assertSame(array(), $this->events->popAll());
    }

    private function pushEvent($creationDate, $category = 'Category', $name = 'myName', $action = 'myAction', $value = 1)
    {
        $this->events->pushEvent($creationDate, $category, $name, $action, $value);
    }


}
