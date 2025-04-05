import useFetch from './useFetch';
import { useEffect, useCallback, useMemo } from 'react';
import { fetchCountries } from '../services/CountriesService';

export const useCitiesListFetch = () => {
  const [state, fetchCities] = useFetch();



  useEffect(() => {
    const handleCitiesFetch = () => {
      fetchCities((signal) => fetchCountries(signal));
    };
    handleCitiesFetch();
  }, []);

  return [state];
};
