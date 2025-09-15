import { COUNTRIES_SERVICE_URL } from '../apis/endpoints';
import { sortCities } from '../utils/countries/sortCities';
import { fetchWithRetries } from './BaseService';
import type { ApiArgs } from '../types/apiCallOptions';
import type { Country } from '../types/country';

export function fetchCountries(opts?: ApiArgs): Promise<Country[]> {
const transport = opts?.args?.transport || {};
  if (opts?.signal) {
    transport.signal = opts.signal;
  }
  
  return fetchWithRetries(
    { url: COUNTRIES_SERVICE_URL, callback: sortCities, transport },
    3
  );
}