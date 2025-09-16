import { ISS_CURRENT_URL, ISS_FUTURE_URL } from '@/apis/endpoints';
import { calcRiseTime } from '@utils/iss/calcRiseTime';
import { fetchWithRetries } from './BaseService';

export async function fetchCurrentTelemetry(transport: Record<string, unknown> = {}): Promise<ISSStats> {
  try {
    const result = await fetchWithRetries(
      { url: ISS_CURRENT_URL, transport },
      3
    );

    // Handle case where fetchWithRetries returns undefined due to error
    if (!result) {
      throw new Error('ISS API returned no data');
    }

    // Validate that the result has the expected structure
    if (!result.units || !result.name || typeof result.latitude !== 'number') {
      throw new Error('ISS API returned invalid data structure');
    }

    return result;
  } catch (error) {
    console.error('ISS telemetry fetch failed:', error);

    // Return fallback data to prevent app crashes
    // This represents a reasonable default position over the Pacific
    // Adding a flag to indicate this is fallback data
    return {
      name: 'iss',
      id: 25544,
      latitude: 0,
      longitude: 0,
      altitude: 408.0,
      velocity: 27.6,
      visibility: 'unknown' as const,
      footprint: 4621.8,
      timestamp: new Date(),
      daynum: Date.now() / 86400000 + 25544, // Approximate day number
      solar_lat: 0,
      solar_lon: 0,
      units: 'kilometers' as const,
      isFallbackData: true, // Flag to indicate server was unreachable
    };
  }
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
