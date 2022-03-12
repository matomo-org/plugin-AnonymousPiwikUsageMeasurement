/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { IScope } from 'angular';
import TrackMultiSites from './TrackMultiSites';

function piwikMultisitesLabel() {
  return {
    restrict: 'A',
    link(scope: IScope, element: JQuery) {
      TrackMultiSites.mounted(element[0]);
    },
  };
}

window.angular.module('piwikApp').directive('piwikMultisitesSite', piwikMultisitesLabel);
