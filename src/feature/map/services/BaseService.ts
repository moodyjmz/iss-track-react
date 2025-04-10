import { logger } from '../utils/logger';

interface FetchOptions {
  transport?: RequestInit; // Represents fetch options like headers, method, etc.
  callback?: (response: any) => any; // Callback function to process the response
}

export interface FetchResult {
  payload?: any;
  error?: Error;
}

export async function fetchJson(url: string, options: FetchOptions = {}): Promise<FetchResult> {
  console.log('FJS', arguments);
  const transportOpts = options.transport ? options.transport : {};

  try {
    const data = await fetch(url, transportOpts).then((r) => r.json());
    return { payload: data };
  } catch (err) {
    return { error: err as Error };
  }
}

export async function makeFetchJsonCall(url: string, signal: AbortSignal): Promise<any> {
  try {
    const response = await fetch(url, { signal });
    if (response.status < 200 || response.status >= 400) {
      return Promise.reject(new Error(`${response.statusText} (${response.status})`));
    }
    return response.json();
  } catch (err) {
    if (signal.aborted) {
      console.info('Aborted', url);
      return Promise.resolve();
    }
    return Promise.reject(new Error(err as string));
  }
}

export function getFetchJsonCall(url: string, options: FetchOptions = {}): () => Promise<FetchResult> {
  return () => fetchJson(url, options);
}

export function fetchData(
  url: string,
  callback?: (response: any) => any
): { promise: Promise<any>; controller: AbortController } {
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = fetch(url, { signal })
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to fetch data: ${url}`);
      return response.json();
    })
    .then((response) => {
      if (callback) {
        return callback(response);
      }
      return response;
    })
    .catch((e) => {
      console.warn(
        `${url} aborted in promise call = most likely caller was dismounted`,
        e
      );
    });

  return { promise, controller };
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

export function getDataPromise(opts: FetchOptions & { url: string }): Promise<any> {
  const promise = fetch(opts.url, opts.transport || {})
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to fetch data: ${opts.url}`);
      return response.json();
    })
    .then((response) => {
      if (opts.callback) {
        return opts.callback(response);
      }
      return response;
    })
    .catch((e) => {
      console.warn(
        `${opts.url} aborted in promise call - most likely caller was dismounted`,
        e
      );
    });

  return promise;
}