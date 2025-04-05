import { useEffect, useState, use, useRef, Suspense, useCallback } from 'react';
import { fetchFuturePositionForLocation } from '../services/IssService';
import RiseTime from './RiseTime';
import Loader from './Loader/Loader';
import { getCityFromId } from '../utils/cities';

export default function FuturePass({ countries }) {
    const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
    const [risePromise, setRisePromise] = useState();
    const selectedCity = useRef();
    const abortController = useRef();
    selectedCity.current = getCityFromId(countries, selectedCountryIndex);


    useEffect(() => {
        abortController.current = new AbortController();
        const { signal } = abortController.current;
        if (!countries || !countries.length) {
            return;
        }
        if (selectedCity.current?.latlng) {
            setRisePromise(fetchFuturePositionForLocation(selectedCity.current, signal));
        }

        return () => abortController.current.abort();

    }, [selectedCountryIndex, countries, selectedCity]);


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
