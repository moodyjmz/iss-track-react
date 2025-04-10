import { COUNTRIES_SERVICE_URL } from '../../../apis/endpoints';
import { sortCities } from '../utils/countries/sortCities';
import { fetchWithRetries } from './BaseService';

interface Transport {
  [key: string]: any; 
}

// Define the return type if fetchWithRetries has a specific return value
export function fetchCountries(transport: Transport = {}, retries: number = 3): Promise<any> {
  return fetchWithRetries(
    { url: COUNTRIES_SERVICE_URL, callback: sortCities, transport },
    retries
  );
}