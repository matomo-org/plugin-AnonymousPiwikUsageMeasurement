/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */

import { Matomo } from 'CoreHome';
import '../types';

const { $ } = window;

const TrackDashboardAction = {
  mounted(el: HTMLElement): void {
    $(el).on('click', '[data-action]', function onClick() {
      const category = 'Dashboard';
      const name = 'WidgetSelector';
      const action = $(this).attr('data-action');

      window._paq.push(['trackEvent', category, action, name]);
    });
  },
};

export default TrackDashboardAction;

Matomo.on('Dashboard.DashboardSettings.mounted', (element: HTMLElement) => {
  TrackDashboardAction.mounted(element);
});
