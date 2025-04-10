import { Country } from '../../defs/country';

export function getCityFromId(countries: Country[], id: number): Country | undefined {
  return countries[id];
}
