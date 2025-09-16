import { useState, useRef, Suspense, useCallback, useMemo, memo } from 'react';
import { fetchFuturePositionForLocation } from '@services/IssService';
import RiseTime from './RiseTime';
import Loader from './Loader/Loader';
import { useAsyncData } from '@hooks/useAsyncData';
import { getCityFromId } from '@utils/countries/getCityFromId';


interface FuturePassProps {
    countries: Country[];
}

function FuturePass({ countries }: FuturePassProps) {
    const [selectedCountryIndex, setSelectedCountryIndex] = useState<number>(0);
    const selectedCity = useRef(getCityFromId(countries, selectedCountryIndex));

    const risePromise = useAsyncData(fetchFuturePositionForLocation, selectedCity.current);

    const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = parseInt(event.target.value, 10);
        setSelectedCountryIndex(newIndex);
        selectedCity.current = getCityFromId(countries, newIndex);
    }, [countries]);

    const countryOptions = useMemo(() =>
        countries.map((country, index) => (
            <option key={index} value={index}>
                {country.capital}
            </option>
        )),
        [countries]
    );
    return (
        <div>
            <select onChange={handleCountryChange} value={selectedCountryIndex}>
                {countryOptions}
            </select>
            <Suspense fallback={<Loader />}>
                {selectedCity.current && `${selectedCity.current.capital}: `}
                {risePromise && <RiseTime risePromise={risePromise} />}
            </Suspense>
        </div>
    );
}

export default memo(FuturePass);