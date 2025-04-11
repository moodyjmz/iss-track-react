import { Coordinates } from '../../defs/coordinates';

interface IssPosition {
    longitude: string;
    latitude: string;
  }
  
  interface Response {
    iss_position?: IssPosition;
  }
  
  export function getLocationCoordinates(res: Response): Coordinates|undefined {    
    if (!res.iss_position) {
      return;
    }
    return {
      longitude: parseInt(res.iss_position.longitude, 10),
      latitude: parseInt(res.iss_position.latitude, 10)
     }
  }
  