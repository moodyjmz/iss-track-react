import { logger } from '../utils/logger';

interface FetchOptions {
  transport?: RequestInit; // Represents fetch options like headers, method, etc.
  callback?: (response: any) => any; // Callback function to process the response
}

export interface FetchResult {
  payload?: any;
  error?: Error;
}

export function fetchWithRetries(opts: FetchOptions & { url: string }, retries = 0): Promise<any> {
  console.log(opts);
  return fetch(opts.url, opts.transport || {})
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      if (retries > 0) {
        return fetchWithRetries(opts, retries - 1);
      }
      throw new Error(`HTTP Error: ${res.status}`);
    })
    .then((response) => {
      if (opts.callback) {
        return opts.callback(response);
      }
      return response;
    })
    .catch((error) => logger.error(error.message));
}