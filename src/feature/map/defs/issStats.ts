export interface ISSStats {
    "name": string,
    "id": number,
    "latitude": number,
    "longitude": number,
    "altitude": number,
    "velocity": number,
    "visibility": 'daylight' | 'eclipsed',
    "footprint": number,
    "timestamp": Date,
    "daynum": number,
    "solar_lat": number,
    "solar_lon": number,
    "units": 'kilometers' | 'miles'
  }
  