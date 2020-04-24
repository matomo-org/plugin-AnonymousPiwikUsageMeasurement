<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;

use Piwik\API\Request;
use Piwik\Container\StaticContainer;
use Piwik\Db;
use Piwik\Piwik;

class CustomVariables
{
    /**
     * We send this data via server to not expose eg PHP version to users
     * @return array
     */
    public function getServerVisitCustomVariables()
    {
        $users = Request::processRequest('UsersManager.getUsers', array('filter_limit' => '-1'));
        $websites = Request::processRequest('SitesManager.getAllSites', array('filter_limit' => '-1'));

        $db = Db::get();
        $mySqlVersion = null;
        if (method_exists($db, 'getServerVersion')) {
            $mySqlVersion = $db->getServerVersion();
        }

        $customVars = array(
            array(
                'id' => 1,
                'name' => 'Matomo Version',
                'value' => StaticContainer::get('AnonymousPiwikUsageMeasurement.piwikVersion'),
            ),
            array(
                'id' => 2,
                'name' => 'PHP Version',
                'value' => StaticContainer::get('AnonymousPiwikUsageMeasurement.phpVersion'),
            ),
            array(
                'id' => 3,
                'name' => 'Num Users',
                'value' => count($users),
            ),
            array(
                'id' => 4,
                'name' => 'Num Websites',
                'value' => count($websites),
            ),
        );

        $segmentClass = 'Piwik\Plugins\SegmentEditor\Services\StoredSegmentService';
        if (class_exists($segmentClass)) {
            $service = StaticContainer::get($segmentClass);
            $segments = $service->getAllSegmentsAndIgnoreVisibility();
            $customVars[] = array(
                'id' => 5,
                'name' => 'Num Segments',
                'value' => count($segments),
            );
        }

        if (isset($mySqlVersion)) {
            $customVars[] = array(
                'id' => 6,
                'name' => 'MySQL Version',
                'value' => $mySqlVersion,
            );
        }

        return $customVars;
    }

    public function getClientVisitCustomVariables()
    {
        if (Piwik::hasUserSuperUserAccess()) {
            $access = 'superuser';
        } elseif (Piwik::isUserIsAnonymous()) {
            $access = 'anonymous';
        } else {
            // I do not check between view/admin as it could trigger slow DB queries to fetch sites with access
            $access = 'user';
        }

        return array(
            array(
                'id' => 1,
                'name' => 'Access',
                'value' => $access,
            )
        );
    }


}