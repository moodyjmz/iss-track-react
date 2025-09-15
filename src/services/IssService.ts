import { ISS_CURRENT_URL, ISS_FUTURE_URL } from '../apis/endpoints';
import type { ISSStats } from '../types/ISSStats';
import type { ApiArgs } from '../types/apiCallOptions';
import type { Position } from '../types/coordinates';
import { calcRiseTime } from '../utils/iss/calcRiseTime';
import { fetchWithRetries } from './BaseService';

export function fetchCurrentTelemetry(transport: Record<string, unknown> = {}): Promise<ISSStats> {
  return fetchWithRetries(
    { url: ISS_CURRENT_URL, transport },
    3
  );
}

export function buildFutureUrl(lat: number, lon: number): string {
  const findReplace = [
    { find: '%lat%', replace: lat.toString() },
    { find: '%lon%', replace: lon.toString() },
  ];
  let futureUrl = ISS_FUTURE_URL;
  findReplace.forEach((replacer) => {
    futureUrl = futureUrl.replace(replacer.find, replacer.replace);
  });
  return futureUrl;
}

export function fetchFuturePositionForLocation(opts: ApiArgs): Promise<any> | undefined {
  if (!opts || !opts.args || !opts.args.latlng) {
    return;
  }
  const url = buildFutureUrl(opts.args.latlng[0], opts.args.latlng[1]);
  const transport = opts.signal ? opts.signal : {};
  return fetchWithRetries({ url, transport, callback: calcRiseTime }, 3);
}
