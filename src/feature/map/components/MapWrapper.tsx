import { use, Suspense, JSX, Context } from 'react';
import Loader from './Loader/Loader';
import FuturePass from './FuturePass';
import MapArea from './MapArea/MapArea';
import { CountriesContext } from '../context/countries';
import { Country } from '../defs/country';

interface MapWrapperProps {
  countriesPromise: Promise<any>;
}

export function MapWrapper(): JSX.Element {
  const countriesPromise = use<Context>(CountriesContext);
  const countries = use<Country[]>(countriesPromise);
  return (
    <div className="app-inner">
      <MapArea />
      <div className="future-wrapper col">
        <Suspense fallback={<Loader />}>
          <FuturePass countries={countries} />
        </Suspense>
      </div>
    </div>
  );
}
