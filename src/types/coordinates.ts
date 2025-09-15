/**
 * Geographic coordinates representing a position on Earth
 */
export interface Coordinates {
    /** Longitude in decimal degrees (-180 to 180) */
    longitude: number;
    /** Latitude in decimal degrees (-90 to 90) */
    latitude: number;
}

/**
 * Position type used by Leaflet maps
 */
export interface Position {
    latlng: [number, number];
}
