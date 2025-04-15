import { Coordinates } from '../../defs/coordinates';

interface IssPosition {
    longitude: string;
    latitude: string;
  }

  
  export function getLocationCoordinates(res: IssPosition): Coordinates {    
    return {
      longitude: parseInt(res.longitude, 10),
      latitude: parseInt(res.latitude, 10)
     }
  }
  