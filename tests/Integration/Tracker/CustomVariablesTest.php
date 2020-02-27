<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\AnonymousPiwikUsageMeasurement\tests\Integration\Tracker;

use Piwik\Db;
use Piwik\Plugins\AnonymousPiwikUsageMeasurement\Tracker\CustomVariables;
use Piwik\Plugins\SegmentEditor\API as SegmentApi;
use Piwik\Plugins\UsersManager\API as UsersApi;
use Piwik\Tests\Framework\Fixture;
use Piwik\Tests\Framework\Mock\FakeAccess;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;
use Piwik\Version;

/**
 * @group AnonymousPiwikUsageMeasurement
 * @group CustomVariables
 * @group CustomVariablesTest
 * @group Plugins
 */
class CustomVariablesTest extends IntegrationTestCase
{
    private $idSite = 1;

    /**
     * @var CustomVariables
     */
    private $customVars;

    public function setUp(): void
    {
        parent::setUp();

        if (!Fixture::siteCreated($this->idSite)) {
            Fixture::createWebsite('2014-01-01 00:00:00');
        }

        $this->customVars = new CustomVariables();
    }

    public function test_getClientVisitCustomVariables_shouldReturnAccessInformation_IfUser()
    {
        FakeAccess::clearAccess($superUser = false, $idSitesAdmin = array($this->idSite));
        $access = $this->makeAccessCustomVar('user');

        $this->assertSame(array($access), $this->customVars->getClientVisitCustomVariables());
    }

    public function test_getClientVisitCustomVariables_shouldReturnAccessInformation_IfAnonymous()
    {
        FakeAccess::clearAccess($superUser = false, array(), array(), $login = 'anonymous');
        $access = $this->makeAccessCustomVar('anonymous');

        $this->assertSame(array($access), $this->customVars->getClientVisitCustomVariables());
    }

    public function test_getClientVisitCustomVariables_shouldReturnAccessInformation_IfSuperuser()
    {
        FakeAccess::clearAccess($superUser = true);
        $access = $this->makeAccessCustomVar('superuser');

        $this->assertSame(array($access), $this->customVars->getClientVisitCustomVariables());
    }

    public function test_getServerVisitCustomVariables_shouldReturnSystemReport()
    {
        FakeAccess::clearAccess($superUser = true);

        for ($i = 1; $i < 15; $i++) {
            if (!Fixture::siteCreated($i)) {
                Fixture::createWebsite('2014-01-01 00:00:00');
            }
        }

        for ($i = 1; $i < 9; $i++) {
            UsersApi::getInstance()->addUser($login = 'test' . $i, 'password0815', "lorem$i@piwik.org");
        }

        for ($i = 1; $i < 5; $i++) {
            SegmentApi::getInstance()->add('Segment' . $i, 'pageUrl%3D@inde');
        }

        $customVars = array(
            array(
                'id' => 1,
                'name' => 'Matomo Version',
                'value' => '2.14.3',
            ),
            array(
                'id' => 2,
                'name' => 'PHP Version',
                'value' => '5.5.27',
            ),
            array(
                'id' => 3,
                'name' => 'Num Users',
                'value' => 8,
            ),
            array(
                'id' => 4,
                'name' => 'Num Websites',
                'value' => 14,
            ),
            array(
                'id' => 5,
                'name' => 'Num Segments',
                'value' => 4,
            ),
            array(
                'id' => 6,
                'name' => 'MySQL Version',
                'value' => Db::get()->getServerVersion(),
            ),
        );

        $this->assertSame($customVars, $this->customVars->getServerVisitCustomVariables());
    }

    private function makeAccessCustomVar($permission)
    {
        return array(
            'id' => 1,
            'name' => 'Access',
            'value' => $permission,
        );
    }

    public function provideContainerConfig()
    {
        return array(
            'Piwik\Access' => new FakeAccess()
        );
    }

}
