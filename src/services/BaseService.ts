import { logger } from '../utils/logger';

interface FetchOptions {
  transport?: RequestInit; 
  callback?: (response: any) => any; 
}

export interface FetchResult {
  payload?: any;
  error?: Error;
}

export function fetchWithRetries(opts: FetchOptions & { url: string }, retries = 0): Promise<any> {
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