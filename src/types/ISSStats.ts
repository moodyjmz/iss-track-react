/**
 * Visibility state of the ISS
 */
export type ISSVisibility = 'daylight' | 'eclipsed';

/**
 * Units used for measurements
 */
export type Units = 'kilometers' | 'miles';

/**
 * International Space Station telemetry data
 */
export interface ISSStats {
    /** Satellite name */
    name: string;
    /** Satellite ID */
    id: number;
    /** Current latitude in decimal degrees */
    latitude: number;
    /** Current longitude in decimal degrees */
    longitude: number;
    /** Altitude in kilometers or miles */
    altitude: number;
    /** Velocity in km/h or mph */
    velocity: number;
    /** Current visibility state */
    visibility: ISSVisibility;
    /** Ground footprint radius in kilometers or miles */
    footprint: number;
    /** Timestamp of the data */
    timestamp: Date;
    /** Julian day number */
    daynum: number;
    /** Solar latitude */
    solar_lat: number;
    /** Solar longitude */
    solar_lon: number;
    /** Units used for measurements */
    units: Units;
}
  