<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\Container\StaticContainer;

class Tasks extends \Piwik\Plugin\Tasks
{
    public function schedule()
    {
        $this->daily('sendSystemReport');
    }

    /**
     * To test execute the following command:
     * `./console core:run-scheduled-tasks "Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tasks.sendSystemReport"`
     *
     * @throws \Exception
     */
    public function sendSystemReport()
    {
        $trackers   = $this->makeTrackers();
        $customVars = $this->getServerVisitCustomVariables();
        $events     = $this->getEventsToTrack();

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

    private function getTargets()
    {
        $targets = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Targets');
        return $targets->getTargets();
    }

    private function getServerVisitCustomVariables()
    {
        $customVars = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\CustomVariables');
        return $customVars->getServerVisitCustomVariables();
    }

    private function getEventsToTrack()
    {
        $events = StaticContainer::get('Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\Events');

        return $events->popAll();
    }

    /**
     * @return Tracker[]
     */
    private function makeTrackers()
    {
        $targets = $this->getTargets();
        $trackers = array();

        foreach ($targets as $target) {
            $tracker = new Tracker($target['idSite'], $target['url']);
            $tracker->setBaseApiUrl($target['url']);
            $tracker->setRequestTimeout($seconds = 15);
            $tracker->setAnonymousUrl();
            $tracker->setUrlReferrer('');
            $trackers[] = $tracker;
        }

        return $trackers;
    }
}
