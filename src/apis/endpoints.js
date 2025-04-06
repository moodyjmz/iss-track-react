// Map from framework specific env vars to JS consts for services
export const COUNTRIES_SERVICE_URL = import.meta.env.VITE_COUNTRIES_SERVICE_URL;
//export const ISS_CURRENT_URL = import.meta.env.VITE_ISS_CURRENT_URL;
export const ISS_CURRENT_URL = 'http://api.open-notify.org/iss-now.json';
export const ISS_FUTURE_URL = import.meta.env.VITE_ISS_PASSES_URL;