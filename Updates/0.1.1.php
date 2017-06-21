<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\Updater;
use Piwik\Updates as PiwikUpdates;
use Piwik\Updater\Migration\Factory as MigrationFactory;

/**
 * Update for version 0.1.1.
 */
class Updates_0_1_1 extends PiwikUpdates
{
    /**
     * @var MigrationFactory
     */
    private $migration;

    public function __construct(MigrationFactory $factory)
    {
        $this->migration = $factory;
    }

    /**
     * Return SQL to be executed in this update.
     *
     * SQL queries should be defined here, instead of in `doUpdate()`, since this method is used
     * in the `core:update` command when displaying the queries an update will run. If you execute
     * queries directly in `doUpdate()`, they won't be displayed to the user.
     *
     * @param Updater $updater
     * @return array ```
     *               array(
     *                   'ALTER .... ' => '1234', // if the query fails, it will be ignored if the error code is 1234
     *                   'ALTER .... ' => false,  // if an error occurs, the update will stop and fail
     *                                            // and user will have to manually run the query
     *               )
     *               ```
     */
    public function getMigrations(Updater $updater)
    {
        $sqls = array(
            $this->migration->db->dropTable('usage_measurement_events'),
            $this->migration->db->createTable('usage_measurement_profiles', array(
                'creation_date' => 'datetime NOT NULL',
                'category' => 'VARCHAR(200) NOT NULL',
                'name' => 'VARCHAR(200) NOT NULL',
                'action' => 'VARCHAR(200) NOT NULL',
                'count' => 'INT UNSIGNED NOT NULL DEFAULT 0' ,
                'wall_time' => 'BIGINT UNSIGNED NOT NULL DEFAULT 0' ,
            ), $primary = array('category', 'name', 'action'))
        );

        return $sqls;
    }

    /**
     * Perform the incremental version update.
     *
     * This method should preform all updating logic. If you define queries in an overridden `getMigrationQueries()`
     * method, you must call {@link Updater::executeMigrationQueries()} here.
     *
     * See {@link Updates} for an example.
     *
     * @param Updater $updater
     */
    public function doUpdate(Updater $updater)
    {
        $updater->executeMigrations(__FILE__, $this->getMigrations($updater));
    }
}
