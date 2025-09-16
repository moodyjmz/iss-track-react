import { getClosestCountry } from './getClosestCountry';

interface CapitalProps {
  position: Coordinates | null;
  countries: Country[] | null;
}

export function getClosestCapital({ position, countries }: CapitalProps): string | undefined {
  if (position && countries) {
    const closestCity = getClosestCountry(
      countries,
      position.latitude,
      position.longitude
    );

    return closestCity?.capital;
  }

  return undefined;
}