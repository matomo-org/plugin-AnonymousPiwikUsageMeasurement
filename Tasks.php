<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\CustomVariables;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Events;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Trackers;

class Tasks extends \Piwik\Plugin\Tasks
{
    /**
     * @var Trackers
     */
    private $trackers;

    /**
     * @var CustomVariables
     */
    private $customVars;

    /**
     * @var Events
     */
    private $events;

    public function __construct(Trackers $trackers, CustomVariables $customVars, Events $events)
    {
        $this->trackers = $trackers;
        $this->customVars = $customVars;
        $this->events = $events;
    }

    public function schedule()
    {
        $scheduledTime = $this->daily('sendSystemReport');
        $scheduledTime->setHour(rand(1, 23)); // make sure not all Piwik instances send data to piwik.org at same time
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tasks.sendSystemReport"`
     *
     * @throws \Exception
     */
    public function sendSystemReport()
    {
        $trackers   = $this->trackers->makeTrackers();
        $customVars = $this->customVars->getServerVisitCustomVariables();
        $events     = $this->events->popAll();

        foreach ($trackers as $tracker) {
            $tracker->enableBulkTracking();

            foreach ($customVars as $customVar) {
                $tracker->setCustomVariable($customVar['id'], $customVar['name'], $customVar['value'], 'visit');
            }

            $tracker->setAnonymousUrl('/system-report');
            $tracker->doTrackPageView('System-Report');

            foreach ($events as $event) {
                $tracker->doTrackEvent($event['event_category'], $event['event_action'], $event['event_name'], $event['event_value']);
            }

            $tracker->doBulkTrack();
        }
    }
}
