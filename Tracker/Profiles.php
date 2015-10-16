<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker;

use Piwik\Common;
use Piwik\Db;
use Piwik\DbHelper;

class Profiles
{
    /**
     * @var Db
     */
    private $db;

    private $tableName = 'usage_measurement_profiles';
    private $tableNamePrefixed;

    public function __construct()
    {
        $this->db = Db::get();
        $this->tableNamePrefixed = Common::prefixTable($this->tableName);
    }

    public function popAll()
    {
        $profiles = $this->db->fetchAll('SELECT * FROM ' . $this->tableNamePrefixed);
        $this->db->query('DELETE FROM ' . $this->tableNamePrefixed);

        return $profiles;
    }

    public function pushProfile($creationDate, $category, $name, $action, $count, $wallTimeInMs)
    {
        $sql  = 'INSERT INTO `' . $this->tableNamePrefixed .
                '` (creation_date, `category`, `name`, `action`, `count`, `wall_time`) ' .
                ' VALUES (?, ?, ?, ?, ?, ?) ' .
                ' ON DUPLICATE KEY UPDATE `count` = `count` + ?, `wall_time` = `wall_time` + ?';
        $bind = array($creationDate, $category, $name, $action, $count, $wallTimeInMs, $count, $wallTimeInMs);

        $this->db->query($sql, $bind);
    }

    public function install()
    {
        $table = "`creation_date` datetime NOT NULL ,
                  `category` VARCHAR(200) NOT NULL ,
                  `name` VARCHAR(200) NOT NULL ,
                  `action` VARCHAR(200) NOT NULL,
                  `count` INT UNSIGNED NOT NULL DEFAULT 0 ,
                  `wall_time` BIGINT UNSIGNED NOT NULL DEFAULT 0 ,
                  PRIMARY KEY(`category`, `name`, `action`)";

        DbHelper::createTable($this->tableName, $table);
    }

    public function uninstall()
    {
        Db::dropTables(array($this->tableNamePrefixed));
    }

}