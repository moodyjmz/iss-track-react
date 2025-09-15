import { use, Suspense, JSX } from 'react';
import Loader from '../../../components/Loader/Loader';
import FuturePass from './FuturePass';
import MapArea from './MapArea/MapArea';
import { Country } from '../../../types/country';

interface MapWrapperProps {
  countriesPromise: Promise<Country[]>;
}

export function MapWrapper({ countriesPromise }: MapWrapperProps): JSX.Element {
  const countries = use(countriesPromise);
  return (
    <div className="app-inner">
      <MapArea countries={countries} />
      <div className="future-wrapper col">
        <Suspense fallback={<Loader />}>
          <FuturePass countries={countries} />
        </Suspense>
      </div>
    </div>
  );
}
