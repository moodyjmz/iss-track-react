/**
 * Country data structure with geographic coordinates
 */
export interface Country {
    /** Coordinates as [latitude, longitude] tuple */
    latlng: [number, number];
    /** Country name */
    name: string;
    /** Capital city name */
    capital: string;
}
  