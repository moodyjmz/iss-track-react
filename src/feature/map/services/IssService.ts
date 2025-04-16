import { ISS_CURRENT_URL, ISS_FUTURE_URL } from '../../../apis/endpoints';
import { ISSStats } from '../defs/issStats';
import { calcRiseTime } from '../utils/iss/calcRiseTime';
import { fetchWithRetries } from './BaseService';

interface Transport {
  [key: string]: any; 
}

interface Position {
  latlng: [number, number];
}

interface FetchFuturePositionOptions {
  args?: Position;
  transport?: Transport;
}

export function fetchCurrentPosition(transport: Transport = {}): Promise<ISSStats> {
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

export function fetchFuturePositionForLocation(opts: FetchFuturePositionOptions): Promise<any> | undefined {
  if (!opts.args || !opts.args.latlng) {
    return;
  }
  const url = buildFutureUrl(opts.args.latlng[0], opts.args.latlng[1]);
  const transport = opts.transport;
  return fetchWithRetries({ url, transport, callback: calcRiseTime }, 3);
}
