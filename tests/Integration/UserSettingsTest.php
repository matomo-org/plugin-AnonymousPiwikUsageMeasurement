<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\UserSettings;
use Piwik\Tests\Framework\Fixture;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group Settings
 * @group UserSettings
 * @group UserSettingsTest
 * @group Plugins
 */
class UserSettingsTest extends IntegrationTestCase
{

    private $idSite = 1;

    /**
     * @var UserSettings
     */
    private $settings;

    public function setUp(): void
    {
        parent::setUp();

        if (!Fixture::siteCreated($this->idSite)) {
            Fixture::createWebsite('2014-01-01 00:00:00');
        }

        $this->settings = new UserSettings(new SystemSettings());
    }

    public function test_userTrackingEnabled_ShouldBeEnabledByDefault()
    {
        $this->assertSame(true, $this->settings->userTrackingEnabled->getValue());
    }

    public function test_userTrackingEnabled_shouldBeWritableDependingOnOptOut()
    {
        $settings = $this->createUserSettingsWithUserOptOut(false);
        $this->assertSame(false, $settings->userTrackingEnabled->isWritableByCurrentUser());

        $settings = $this->createUserSettingsWithUserOptOut(true);
        $this->assertSame(true, $settings->userTrackingEnabled->isWritableByCurrentUser());
    }

    private function createUserSettingsWithUserOptOut($optOut)
    {
        $system = new SystemSettings();
        $system->canUserOptOut->setValue($optOut);
        return new UserSettings($system);
    }

}
