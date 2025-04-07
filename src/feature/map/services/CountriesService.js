import { COUNTRIES_SERVICE_URL } from '../../../apis/endpoints';
import { sortCities } from '../utils/countries';
import { fetchWithRetries } from './BaseService';

export function fetchCountries(transport = {}, retries = 3) {
  return fetchWithRetries({url:COUNTRIES_SERVICE_URL, callback: sortCities, transport}, retries);
}