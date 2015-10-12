<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration;

use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Settings;
use Piwik\Tests\Framework\Fixture;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group Settings
 * @group SettingsTest
 * @group Plugins
 */
class SettingsTest extends IntegrationTestCase
{

    private $idSite = 1;

    /**
     * @var Settings
     */
    private $settings;

    public function setUp()
    {
        parent::setUp();

        if (!Fixture::siteCreated($this->idSite)) {
            Fixture::createWebsite('2014-01-01 00:00:00');
        }

        $this->settings = new Settings();
    }

    public function test_userTrackingEnabled_ShouldBeEnabledByDefault()
    {
        $this->assertSame(true, $this->settings->userTrackingEnabled->getValue());
    }

    public function test_canUserOptOut_ShouldBeEnabledByDefault()
    {
        $this->assertSame(true, $this->settings->canUserOptOut->getValue());
    }

    public function test_trackToPiwik_ShouldBeEnabledByDefault()
    {
        $this->assertSame(true, $this->settings->trackToPiwik->getValue());
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

    /**
     * @expectedException \Exception
     * @expectedExceptionMessage Site Id 'MyTest0' should be a number
     */
    public function test_ownPiwikSiteId_shouldThrowAnException_IfValueIsNotNumeric()
    {
        $this->settings->ownPiwikSiteId->setValue('MyTest0');
    }

    /**
     * @expectedException \Exception
     * @expectedExceptionMessage The specified idSite '5' does not exist
     */
    public function test_ownPiwikSiteId_shouldThrowAnException_IfSiteIdDoesNotExist()
    {
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

    /**
     * @expectedException \Exception
     * @expectedExceptionMessage URL 'http:/Valtes.com/idUrl' seems to be not a valid URL
     */
    public function test_customPiwikSiteUrl_shouldThrowAnException_WhenNotAValidUrlIsSet()
    {
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

    /**
     * @expectedException \Exception
     * @expectedExceptionMessage Site Id 'MyTest0' should be a number
     */
    public function test_customPiwikSiteId_shouldThrowAnException_IfValueIsNotNumeric()
    {
        $this->settings->customPiwikSiteId->setValue('MyTest0');
    }

}
