import { getClosestCapital } from '../utils/countries';
export function useGetClosestCapital({ position, countries }) {
    let closestCityName;
    if (position && position.latitude && countries) {
        const closestCity = getClosestCapital
            (
                countries,
                position.latitude,
                position.longitude
            );
        if (closestCity && closestCity.name) {
            closestCityName = closestCity.capital;
        }
    }

    return closestCityName;
}