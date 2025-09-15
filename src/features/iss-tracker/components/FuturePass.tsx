import { useState, useRef, Suspense, useCallback, JSX } from 'react';
import { fetchFuturePositionForLocation } from '../../../services/IssService';
import RiseTime from './RiseTime';
import Loader from './Loader/Loader';
import { useAsyncData } from '../../../hooks/useAsyncData';
import { getCityFromId } from '../../../utils/countries/getCityFromId';
import { Country } from '../../../types/country';


interface FuturePassProps {
    countries: Country[];
}

export default function FuturePass({ countries }: FuturePassProps): JSX.Element {
    const [selectedCountryIndex, setSelectedCountryIndex] = useState<number>(0);
    const selectedCity = useRef(getCityFromId(countries, selectedCountryIndex));

    const risePromise = useAsyncData(fetchFuturePositionForLocation, selectedCity.current);

    const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = parseInt(event.target.value, 10);
        setSelectedCountryIndex(newIndex);
        selectedCity.current = getCityFromId(countries, newIndex);
    }, [countries]);
    return (
        <div>
            <select onChange={handleCountryChange} value={selectedCountryIndex}>
                {countries.map((country, index) => (
                    <option key={index} value={index}>
                        {country.capital}
                    </option>
                ))}
            </select>
            <Suspense fallback={<Loader />}>
                {selectedCity.current && `${selectedCity.current.capital}: `}
                {risePromise && <RiseTime risePromise={risePromise} />}
            </Suspense>
        </div>
    );
}