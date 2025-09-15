/**
 * Transport options for API calls
 */
export interface Transport {
  signal?: AbortSignal;
  [key: string]: unknown;
}

/**
 * Options for API calls including arguments and transport settings
 */
export interface ApiCallOptions {
  args?: Record<string, unknown>;
  transport?: Transport;
}

/**
 * Arguments passed to API functions
 */
export interface ApiArgs {
  args?: Record<string, unknown>;
  signal?: AbortSignal;
}

/**
 * Generic API fetch function type
 */
export type ApiFetchFunction<T = unknown> = (opts?: ApiArgs) => Promise<T>;