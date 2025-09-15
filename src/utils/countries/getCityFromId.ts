import { Country } from '../../types/country';

export function getCityFromId(countries: Country[], id: number): Country | undefined {
  return countries[id];
}
