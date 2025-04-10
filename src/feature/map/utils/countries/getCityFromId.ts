import { Country } from '../../defs/country';

export function getCityFromId(countries: [Country], id:number) {
    return countries[id];
  }