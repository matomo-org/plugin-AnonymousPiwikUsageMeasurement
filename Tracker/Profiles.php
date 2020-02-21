<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;

use Piwik\Common;
use Piwik\Db;
use Piwik\DbHelper;

class Profiles
{
    private $tableName = 'usage_measurement_profiles';
    private $tableNamePrefixed;

    public function __construct()
    {
        $this->tableNamePrefixed = Common::prefixTable($this->tableName);
    }

    public function popAll()
    {
        $profiles = Db::get()->fetchAll('SELECT * FROM ' . $this->tableNamePrefixed);
        Db::get()->query('DELETE FROM ' . $this->tableNamePrefixed);

        return $profiles;
    }

    public function pushProfile($creationDate, $category, $name, $action, $count, $wallTimeInMs)
    {
        $sql  = 'INSERT INTO `' . $this->tableNamePrefixed .
                '` (creation_date, `category`, `name`, `action`, `count`, `wall_time`) ' .
                ' VALUES (?, ?, ?, ?, ?, ?) ' .
                ' ON DUPLICATE KEY UPDATE `count` = `count` + ?, `wall_time` = `wall_time` + ?';
        $bind = array($creationDate, $category, $name, $action, $count, $wallTimeInMs, $count, $wallTimeInMs);

        Db::get()->query($sql, $bind);
    }

    public function install()
    {
        $table = "`creation_date` datetime NOT NULL ,
                  `category` VARCHAR(200) NOT NULL ,
                  `name` VARCHAR(200) NOT NULL ,
                  `action` VARCHAR(200) NOT NULL,
                  `count` INT UNSIGNED NOT NULL DEFAULT 0 ,
                  `wall_time` BIGINT UNSIGNED NOT NULL DEFAULT 0 ,
                  PRIMARY KEY(`category`(64), `name`(64), `action`(63))";

        DbHelper::createTable($this->tableName, $table);
    }

    public function uninstall()
    {
        Db::dropTables(array($this->tableNamePrefixed));
    }

}