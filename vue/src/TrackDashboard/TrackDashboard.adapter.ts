/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { IScope } from 'angular';
import TrackDashboard from './TrackDashboard';

function piwikWidgetId() {
  return {
    restrict: 'A',
    priority: 20,
    link(scope: IScope, element: JQuery) {
      TrackDashboard.mounted(element[0]);
    },
  };
}

window.angular.module('piwikApp').directive('piwikDashboard', piwikWidgetId);
