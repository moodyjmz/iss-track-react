import { getDistance } from 'geolib';


export function getClosestCapital(countries, lat, lng) {
  let closestCountryIndex;
  let closestDistance;

  countries.forEach((country, index) => {
    if (country.latlng[0]) {
      let distance = getDistance(
        { latitude: country.latlng[0], longitude: country.latlng[1] },
        { latitude: lat, longitude: lng }
      );
      if (closestCountryIndex === undefined
        || (distance < closestDistance)) {
        closestCountryIndex = index;
        closestDistance = distance;
      }
    }

  });
  return closestCountryIndex && countries[closestCountryIndex];

}