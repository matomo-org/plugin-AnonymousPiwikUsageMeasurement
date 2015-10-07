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

class Events
{
    /**
     * @var Db
     */
    private $db;

    private $tableName = 'usage_measurement_events';
    private $tableNamePrefixed;

    public function __construct()
    {
        $this->db = Db::get();
        $this->tableNamePrefixed = Common::prefixTable($this->tableName);
    }

    public function popAll()
    {
        $events = $this->db->fetchAll('SELECT * FROM ' . $this->tableNamePrefixed);
        $this->db->query('DELETE FROM ' . $this->tableNamePrefixed);

        return $events;
    }

    public function pushEvent($creationDate, $category, $name, $action, $value)
    {
        $sql  = 'INSERT INTO `' . $this->tableNamePrefixed .
                '` (creation_date, event_category, event_name, event_action, event_value) ' .
                ' VALUES (?, ?, ?, ?, ?) ' .
                ' ON DUPLICATE KEY UPDATE event_value = event_value + ?';
        $bind = array($creationDate, $category, $name, $action, $value, $value);

        $this->db->query($sql, $bind);
    }

    public function install()
    {
        $table = "`creation_date` datetime NOT NULL ,
                  `event_category` VARCHAR(200) NOT NULL ,
                  `event_name` VARCHAR(200) NOT NULL ,
                  `event_action` VARCHAR(200) NOT NULL,
                  `event_value` TINYINT UNSIGNED NOT NULL DEFAULT 1 ,
                  PRIMARY KEY(event_category, event_name, event_action)";

        DbHelper::createTable($this->tableName, $table);
    }

    public function uninstall()
    {
        Db::dropTables(array($this->tableNamePrefixed));
    }

}