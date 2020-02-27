<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings;
use Piwik\Tests\Framework\Fixture;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group Settings
 * @group SystemSettingsTest
 * @group Plugins
 */
class SystemSettingsTest extends IntegrationTestCase
{

    private $idSite = 1;

    /**
     * @var SystemSettings
     */
    private $settings;

    public function setUp(): void
    {
        parent::setUp();

        if (!Fixture::siteCreated($this->idSite)) {
            Fixture::createWebsite('2014-01-01 00:00:00');
        }

        $this->settings = new SystemSettings();
    }

    public function test_canUserOptOut_ShouldBeEnabledByDefault()
    {
        $this->assertSame(true, $this->settings->canUserOptOut->getValue());
    }

    public function test_ownPiwikSiteId_shouldBeZeroByDefault()
    {
        $this->assertSame(0, $this->settings->ownPiwikSiteId->getValue());
    }

    public function test_ownPiwikSiteId_shouldNotThrowAnException_WhenSavingEmptyValue()
    {
        $this->settings->ownPiwikSiteId->setValue('');

        $this->assertSame(0, $this->settings->ownPiwikSiteId->getValue());
    }

    public function test_ownPiwikSiteId_shouldThrowAnException_IfValueIsNotNumeric()
    {
        $this->expectException(\Exception::class);
        $this->expectDeprecationMessage("Site Id 'MyTest0' should be a number");
        $this->settings->ownPiwikSiteId->setValue('MyTest0');
    }

    public function test_ownPiwikSiteId_shouldThrowAnException_IfSiteIdDoesNotExist()
    {
        $this->expectException(\Exception::class);
        $this->expectDeprecationMessage("The specified idSite '5' does not exist");
        $this->settings->ownPiwikSiteId->setValue('5');
    }

    public function test_ownPiwikSiteId_shouldSaveValue_IfSiteIdExistsAndIsNumeric()
    {
        $this->settings->ownPiwikSiteId->setValue($this->idSite);
        $this->assertSame($this->idSite, $this->settings->ownPiwikSiteId->getValue());
    }

    public function test_customPiwikSiteUrl_shouldBeAnEmptyStringByDefault()
    {
        $this->assertSame('', $this->settings->customPiwikSiteUrl->getValue());
    }

    public function test_customPiwikSiteUrl_shouldAppendPiwikPhpIfNeeded()
    {
        $this->settings->customPiwikSiteUrl->setValue('http://example.com');
        $this->assertSame('http://example.com/piwik.php', $this->settings->customPiwikSiteUrl->getValue());

        $this->settings->customPiwikSiteUrl->setValue('http://example.com/');
        $this->assertSame('http://example.com/piwik.php', $this->settings->customPiwikSiteUrl->getValue());

        $this->settings->customPiwikSiteUrl->setValue('http://example.com/piwik.php');
        $this->assertSame('http://example.com/piwik.php', $this->settings->customPiwikSiteUrl->getValue());
    }

    public function test_customPiwikSiteUrl_shouldThrowAnException_WhenNotAValidUrlIsSet()
    {
        $this->expectException(\Exception::class);
        $this->expectDeprecationMessage("URL 'http:/Valtes.com/idUrl' seems to be not a valid URL");
        $this->settings->customPiwikSiteUrl->setValue('http:/Valtes.com/idUrl');
    }

    public function test_ownPiwikSiteUrl_shouldNotThrowAnException_WhenSavingEmptyValue()
    {
        $this->settings->customPiwikSiteUrl->setValue('');

        $this->assertSame('', $this->settings->customPiwikSiteUrl->getValue());
    }

    public function test_customPiwikSiteId_shouldBeZeroByDefault()
    {
        $this->assertSame(0, $this->settings->customPiwikSiteId->getValue());
    }

    public function test_customPiwikSiteId_shouldNotThrowAnException_WhenSavingEmptyValue()
    {
        $this->settings->customPiwikSiteId->setValue('');

        $this->assertSame(0, $this->settings->customPiwikSiteId->getValue());
    }

    public function test_customPiwikSiteId_shouldSaveAnySiteId_WithoutCheckForExistenceOnRemoteSystem()
    {
        $this->settings->customPiwikSiteId->setValue('95');

        $this->assertSame(95, $this->settings->customPiwikSiteId->getValue());
    }

    public function test_customPiwikSiteId_shouldThrowAnException_IfValueIsNotNumeric()
    {
        $this->expectException(\Exception::class);
        $this->expectDeprecationMessage("Site Id 'MyTest0' should be a number");
        $this->settings->customPiwikSiteId->setValue('MyTest0');
    }

}
