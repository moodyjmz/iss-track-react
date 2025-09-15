import { COUNTRIES_SERVICE_URL } from '../apis/endpoints';
import { sortCities } from '../utils/countries/sortCities';
import { fetchWithRetries } from './BaseService';
import { ApiArgs } from '../hooks/useAsyncData';

export function fetchCountries(opts?: ApiArgs): Promise<any> {
const transport = opts?.args?.transport || {};
  if (opts?.signal) {
    transport.signal = opts.signal;
  }
  
  return fetchWithRetries(
    { url: COUNTRIES_SERVICE_URL, callback: sortCities, transport },
    3
  );
}