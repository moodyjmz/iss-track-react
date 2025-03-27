import { useEffect, useState } from 'react';
import { positionFutureList } from '../services/IssService';
import { getCityFromId } from '../models/CountriesModel';
import useApi from './useApi';

export default function useGetRiseTime(selectedCity) {
    const [data, setData] = useState(null);


    const apiResponse = useApi(positionFutureList(selectedCity));

    useEffect(() => {
        let ignore = false;
        if (selectedCity.latlng && !ignore) {
            setData(apiResponse.data);
        }
        return () => {
            ignore = true;
        }
    }, [apiResponse]);
    return { data, raw: apiResponse };
}
