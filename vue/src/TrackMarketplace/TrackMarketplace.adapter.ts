/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { IScope } from 'angular';
import TrackMarketplace from './TrackMarketplace';

function piwikMarketplace() {
  return {
    restrict: 'C',
    priority: 20,
    link(scope: IScope, element: JQuery) {
      TrackMarketplace.mounted(element[0]);
    },
  };
}

window.angular.module('piwikApp').directive('marketplace', piwikMarketplace);
