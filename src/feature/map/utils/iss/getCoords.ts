import { Coordinates } from '../../defs/coordinates';

interface IssPosition {
    longitude: string;
    latitude: string;
  }
  
  interface Response {
    iss_position?: IssPosition;
  }
  
  export function getLocationCoordinates(res: Response): Coordinates {
    const coords: Coordinates = {};
    
    if (res.iss_position) {
      coords.longitude = Number(res.iss_position.longitude);
      coords.latitude = Number(res.iss_position.latitude);
    }
  
    return coords;
  }
  