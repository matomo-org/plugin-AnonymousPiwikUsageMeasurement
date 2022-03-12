/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { IScope } from 'angular';
import TrackEmailReports from './TrackEmailReports';

function piwikEmailReports() {
  return {
    restrict: 'C',
    link(scope: IScope, element: JQuery) {
      TrackEmailReports.mounted(element[0]);
    },
  };
}

window.angular.module('piwikApp').directive('emailReports', piwikEmailReports);
