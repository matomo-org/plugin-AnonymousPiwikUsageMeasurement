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

const TrackDashboard = {
  mounted(el: HTMLElement): void {
    $(el).on('click', '#close,#minimise,#maximise,#refresh', function onClick() {
      const $widget = $(this);

      if (!$widget.parents('.sortable').length) {
        return;
      }

      const category = 'Dashboard';
      const name = 'Widget';
      const action = $(this).attr('id');

      window._paq.push(['trackEvent', category, action, name]);
    });
  },
};

export default TrackDashboard;

Matomo.on('Dashboard.Dashboard.mounted', ({ element }: { element: HTMLElement }) => {
  TrackDashboard.mounted(element);
});
