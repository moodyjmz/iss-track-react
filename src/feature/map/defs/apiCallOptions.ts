interface Transport {
  [key: string]: any;
}

export interface ApiCallOptions {
  args?: any;
  transport?: Transport;
}