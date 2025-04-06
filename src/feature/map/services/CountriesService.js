import { COUNTRIES_SERVICE_URL } from '../../../apis/endpoints';
import { sortCities } from '../utils/cities';
import { fetchWithRetries } from './BaseService';

export function fetchCountries(transport = {}, retries = 3) {
  console.log('COUNTRIES_SERVICE_URL', COUNTRIES_SERVICE_URL);
  return fetchWithRetries({url:COUNTRIES_SERVICE_URL, callback: sortCities, transport}, retries);
}