import { Coordinates } from '../../defs/coordinates';
import { ISSStats } from '../../defs/issStats';

  
  export function getLocationCoordinates(res: ISSStats): Coordinates {    
    return {
      longitude: res.longitude,
      latitude: res.latitude
     }
  }
  