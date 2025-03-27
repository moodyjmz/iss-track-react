import { useState, useEffect } from 'react';
import { getClosestCountry } from '../utils/cities';
export default function useGetClosestCity({ position, countries }) {
    const [closestCityName, setClosestCityName] = useState(null);

    useEffect(() => {
        if (position && position.latitude && countries) {
            const closestCity = getClosestCountry
            (
                countries,
                position.latitude,
                position.longitude
            );
            if (closestCity && closestCity.name) {
                setClosestCityName(closestCity.capital);
            }
        }
    }, [position, countries]);

    return closestCityName;
}