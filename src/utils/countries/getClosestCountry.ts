import { getDistance } from 'geolib';


export function getClosestCountry(
  countries: Country[],
  lat: number,
  lng: number
): Country | null {
  const closestCountry = countries.reduce<{ country: Country | null; distance: number }>(
    (closest, country) => {
      if (!country.latlng[0]) return closest;

      const distance = getDistance(
        { latitude: country.latlng[0], longitude: country.latlng[1] },
        { latitude: lat, longitude: lng }
      );

      return distance < closest.distance
        ? { country, distance }
        : closest;
    },
    { country: null, distance: Infinity }
  );

  return closestCountry.country;
}