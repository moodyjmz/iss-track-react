import { use, Suspense, JSX, Context, Usable } from 'react';
import Loader from './Loader/Loader';
import FuturePass from './FuturePass';
import MapArea from './MapArea/MapArea';
import { CountriesContext } from '../context/countries';
import { Country } from '../defs/country';


export function MapWrapper(): JSX.Element {
  const countriesPromise = use<Promise<Country[]>|null>(CountriesContext);
  const countries = use<Promise<Country[]>>(countriesPromise);
  
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
