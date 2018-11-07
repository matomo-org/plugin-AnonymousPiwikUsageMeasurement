<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;

class Trackers
{
    /**
     * @var Targets
     */
    private $targets;

    public function __construct(Targets $targets)
    {
        $this->targets = $targets;
    }

    /**
     * We send this data via server to not expose eg PHP version to users
     * @return Tracker[]
     */
    public function makeTrackers()
    {
        $trackers = array();
        $targets  = $this->targets->getTargets();

        foreach ($targets as $target) {
            $tracker = new Tracker($target['idSite'], $target['url']);
            $tracker->setBaseApiUrl($target['url']);
            $tracker->setRequestTimeout($seconds = 15);
            $tracker->setAnonymousUrl();
            $tracker->setUrlReferrer('');
            if (isset($target['token_auth'])) {
                $tracker->setTokenAuth($target['token_auth']);
            }
            $trackers[] = $tracker;
        }

        return $trackers;
    }

}