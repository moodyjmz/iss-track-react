import { logger } from '../utils/logger';

export async function fetchJson(url, options = {}) {
  console.log('FJS', arguments);
  const transportOpts = options.transport ? options.transport : {};

  try {
    const data = await fetch(url, transportOpts).then(r => r.json());
    return { payload: data };
  } catch (err) {
    return { error: err }; // eslint-disable-line
  }
}

export async function makeFetchJsonCall(url, signal) {
  try {
    const response = await fetch(url, {signal});
    if (response.status < 200 || response.status >= 400) {
      return Promise.reject(new Error(response));
    }
    return response.json();
  } catch (err) {
    if(signal.aborted) {
      console.info('Aborted', url);
      return Promise.resolve();
    }
    return Promise.reject(new Error(err));
  }
}

export function getFetchJsonCall(url, options = {}) {
  return () => fetchJson(url, options);
}

export function fetchData(url, callback) {
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = fetch(url, { signal })
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch data', url);
      return response.json();
    })
    // To keep the chain intact, we add a callback feature after the data is fetched
    .then(response => {
      if(callback) {
        return callback(response);
      }
      return response;
    })
    .catch((e) => {
      //Would be nice to handle this better, however is not likely to be called under normal usage
      console.warn(`${url} aborted in promise call = most likely caller was dismounted`, e);
    });

  return { promise, controller };
}

export function fetchWithRetries(opts, retries = 0) {
  console.log(opts);
  return fetch(opts.url, opts.transport || {})
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      if (retries > 0) {
        return fetchWithRetries(opts, retries - 1)
      }
      throw new Error(res.status);
    })
    // To keep the chain intact, we add a callback feature after the data is fetched
    .then(response => {
      if(opts.callback) {
        return opts.callback(response);
      }
      return response;
    })
    .catch((error) => logger.error(error.message))
}


export function getDataPromise(opts) {

  const promise = fetch(opts.url, opts.transport || {})
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch data', opts.url);
      return response.json();
    })
    // To keep the chain intact, we add a callback feature after the data is fetched
    .then(response => {
      if(opts.callback) {
        return opts.callback(response);
      }
      return response;
    })
    .catch((e) => {
      //Would be nice to handle this better, however is not likely to be called under normal usage
      console.warn(`${opts.url} aborted in promise call = most likely caller was dismounted`, e);
    });

  return promise;
}