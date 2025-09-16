declare global {
  /**
   * Transport options for API calls
   */
  interface Transport {
    signal?: AbortSignal;
    [key: string]: unknown;
  }

  /**
   * Options for API calls including arguments and transport settings
   */
  interface ApiCallOptions {
    args?: Record<string, unknown>;
    transport?: Transport;
  }

  /**
   * Arguments passed to API functions
   */
  interface ApiArgs {
    args?: Record<string, unknown>;
    signal?: AbortSignal;
  }

  /**
   * Generic API fetch function type
   */
  type ApiFetchFunction<T = unknown> = (opts?: ApiArgs) => Promise<T>;
}

export {};