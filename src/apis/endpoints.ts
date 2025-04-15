// Map from framework-specific environment variables to TypeScript constants for services

export const COUNTRIES_SERVICE_URL: string = import.meta.env.VITE_COUNTRIES_SERVICE_URL as string;
export const ISS_CURRENT_URL: string = import.meta.env.VITE_ISS_CURRENT_URL as string;
export const ISS_FUTURE_URL: string = import.meta.env.VITE_ISS_PASSES_URL as string;