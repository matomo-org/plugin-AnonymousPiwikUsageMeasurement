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

// The widget controls are rendered by CoreHome.ReportHeader, which bridges each intent as a
// bubbling `widgetcontrol:*` event instead of the former #close/#minimise/#maximise/#refresh
// elements.
const CONTROL_EVENTS = [
  'widgetcontrol:close',
  'widgetcontrol:minimise',
  'widgetcontrol:maximise',
  'widgetcontrol:refresh',
].join(' ');

function onWidgetControl(event: { type: string; target: unknown }) {
  const $widget = $(event.target as HTMLElement);

  if (!$widget.parents('.sortable').length) {
    return;
  }

  const category = 'Dashboard';
  const name = 'Widget';
  const action = event.type.replace('widgetcontrol:', '');

  window._paq.push(['trackEvent', category, action, name]);
}

const TrackDashboard = {
  mounted(): void {
    $('body').on(CONTROL_EVENTS, onWidgetControl);
  },
  unmounted(): void {
    $('body').off(CONTROL_EVENTS, onWidgetControl);
  },
};

export default TrackDashboard;

Matomo.on('Dashboard.Dashboard.mounted', () => {
  TrackDashboard.mounted();
});

Matomo.on('Dashboard.Dashboard.unmounted', () => {
  TrackDashboard.unmounted();
});
