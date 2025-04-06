import { useEffect, useState, use, useRef, Suspense, useCallback } from 'react';
import { fetchFuturePositionForLocation } from '../services/IssService';
import RiseTime from './RiseTime';
import Loader from './Loader/Loader';
import { getCityFromId } from '../utils/cities';
import { useAsyncData } from '../hooks/useAsyncData';

export default function FuturePass({ countries }) {
    const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
    const selectedCity = useRef();
    selectedCity.current = getCityFromId(countries, selectedCountryIndex);
    const risePromise = useAsyncData(fetchFuturePositionForLocation, selectedCity.current);

    const handleCountryChange = useCallback((event) => {
        setSelectedCountryIndex(event.target.value);
    });
    return (
        <>
            <select onChange={handleCountryChange} value={selectedCountryIndex}>
                {Array.isArray(countries) && countries.map((country, index) => <option key={index} value={index}>{country.capital}</option>)}
            </select>
            <Suspense fallback={<Loader />}>
                {selectedCity.current && `${selectedCity.current.capital}: `}
                {risePromise && <RiseTime risePromise={risePromise} />}
            </Suspense>
        </>
    );
}
