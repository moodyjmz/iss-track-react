declare global {
  /**
   * Geographic coordinates representing a position on Earth
   */
  interface Coordinates {
      /** Longitude in decimal degrees (-180 to 180) */
      longitude: number;
      /** Latitude in decimal degrees (-90 to 90) */
      latitude: number;
  }

  /**
   * Position type used by Leaflet maps
   */
  interface Position {
      latlng: [number, number];
  }
}

export {};
