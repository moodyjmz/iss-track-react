import { useState, useEffect } from 'react';
import { getClosestCountry } from '../utils/cities';
export default function useGetClosestCity({ position, countries }) {
    let closestCityName;
    if (position && position.latitude && countries) {
        const closestCity = getClosestCountry
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