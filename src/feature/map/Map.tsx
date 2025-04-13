import { use, Suspense, JSX } from 'react';
import { fetchCountries } from './services/CountriesService';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useAsyncData } from './hooks/useAsyncData';
import './map.css';
import { MapWrapper } from './components/MapWrapper';

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