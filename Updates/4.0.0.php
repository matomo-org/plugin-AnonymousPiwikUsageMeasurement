<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

use Piwik\Common;
use Piwik\DbHelper;
use Piwik\Updater;
use Piwik\Updates as PiwikUpdates;
use Piwik\Updater\Migration\Factory as MigrationFactory;

/**
 * Update for version 4.0.0.
 */
class Updates_4_0_0 extends PiwikUpdates
{
    /**
     * @var MigrationFactory
     */
    private $migration;

    public function __construct(MigrationFactory $factory)
    {
        $this->migration = $factory;
    }

    public function getMigrations(Updater $updater)
    {
        $migrations = [];

        if ('utf8mb4' === DbHelper::getDefaultCharset()) {
            $migrations[] = $this->migration->db->dropPrimaryKey('usage_measurement_profiles');
            $migrations[] = $this->migration->db->sql(sprintf(
                'ALTER TABLE `%s` ADD PRIMARY KEY(%s)',
                Common::prefixTable('usage_measurement_profiles'),
                implode(', ', ['`category`(64)', '`name`(64)', '`action`(63)'])
            ));
        }

        return $migrations;
    }

    public function doUpdate(Updater $updater)
    {
        $updater->executeMigrations(__FILE__, $this->getMigrations($updater));
    }
}
