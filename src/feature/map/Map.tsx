import MapArea from './components/MapArea/MapArea';
import FuturePass from './components/FuturePass';
import { use, Suspense, JSX } from 'react';
import { fetchCountries } from './services/CountriesService';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Loader from './components/Loader/Loader';
import { useAsyncData } from './hooks/useAsyncData';
import './map.css';

interface MapWrapperProps {
  countriesPromise: Promise<any>;
}

function MapWrapper({ countriesPromise }: MapWrapperProps): JSX.Element {
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

function fallbackRender({ error, resetErrorBoundary }: FallbackProps): JSX.Element {
    return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

export default function Map(): JSX.Element {
  const countriesPromise = useAsyncData(fetchCountries);
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={(details) => {
        console.warn(details);
      }}
    >
      {countriesPromise && <MapWrapper countriesPromise={countriesPromise} />}
    </ErrorBoundary>
  );
}