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

function onClick(this: HTMLElement) {
  const $widget = $(this);

  if (!$widget.parents('.sortable').length) {
    return;
  }

  const category = 'Dashboard';
  const name = 'Widget';
  const action = $(this).attr('id');

  window._paq.push(['trackEvent', category, action, name]);
}

const TrackDashboard = {
  mounted(): void {
    $('body').on('click', '.widget #close,#minimise,#maximise,#refresh', onClick);
  },
  unmounted(): void {
    $('body').off('click', '.widget #close,#minimise,#maximise,#refresh', onClick);
  },
};

export default TrackDashboard;

Matomo.on('Dashboard.Dashboard.mounted', () => {
  TrackDashboard.mounted();
});

Matomo.on('Dashboard.Dashboard.unmounted', () => {
  TrackDashboard.unmounted();
});
