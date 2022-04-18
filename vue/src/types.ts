/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */

export interface MatomoQueue {
  push(args: unknown[]): void;
}

export interface UsageTrackingGlobal {
  trackingDomain: string;
  exampleDomain: string;
}

declare global {
  interface Window {
    _paq: MatomoQueue;
    piwikUsageTracking: UsageTrackingGlobal;
  }
}
