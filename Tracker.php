<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement;

require_once PIWIK_INCLUDE_PATH . '/libs/PiwikTracker/PiwikTracker.php';

/**
 * The default PiwikTracker cannot handle multiple instances to different URLs see
 * https://github.com/piwik/piwik-php-tracker/issues/14
 */
class Tracker extends \PiwikTracker
{
    private $baseApiUrl;

    /**
     * The method name is not ideal but want to make sure PiwikTracker won't define such method at some point.
     * @param string $baseApiUrl eg 'http://demo-anonymous.matomo.org/piwik.php'
     */
    public function setBaseApiUrl($baseApiUrl)
    {
        $this->baseApiUrl = $baseApiUrl;
    }

    public function setAnonymousUrl($path = '')
    {
        $this->setUrl(AnonymousPiwikUsageMeasurement::TRACKING_DOMAIN . $path);
    }

    /**
     * Returns the base URL for the piwik server.
     */
    protected function getBaseUrl()
    {
        if (!empty($this->baseApiUrl)) {
            return $this->baseApiUrl;
        }

        return parent::getBaseUrl();
    }

}
