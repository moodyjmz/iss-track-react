import { use, Suspense, JSX } from 'react';
import Loader from './Loader/Loader';
import FuturePass from './FuturePass';
import MapArea from './MapArea/MapArea';

interface MapWrapperProps {
  countriesPromise: Promise<any>;
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
