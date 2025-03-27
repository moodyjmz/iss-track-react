// Map from framework specific env vars to JS consts for services
export const COUNTRIES_SERVICE_URL = process.env.REACT_APP_COUNTRIES_SERVICE_URL;
//export const ISS_CURRENT_URL = process.env.REACT_APP_ISS_CURRENT_URL;
export const ISS_CURRENT_URL = 'http://api.open-notify.org/iss-now.json';
export const ISS_FUTURE_URL = process.env.REACT_APP_ISS_PASSES_URL;