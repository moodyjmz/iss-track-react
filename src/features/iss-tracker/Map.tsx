import { use, Suspense, useEffect } from 'react';
import { fetchCountries } from '@services/CountriesService';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useAsyncData } from '@hooks/useAsyncData';
import './map.css';
import { MapWrapper } from './components/MapWrapper';
import { WindowStateContext } from '@context/WindowState';
import { useIsPageFocused } from '@hooks/useIsPageFocused';
import OrbitalControlPanel from '@components/OrbitalControlPanel/OrbitalControlPanel';

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

export default function Map(): JSX.Element {

  const windowStateContext = use(WindowStateContext);
  const { isActive, setIsActive } = windowStateContext;
  useIsPageFocused(setIsActive);
  const countriesPromise = useAsyncData(fetchCountries);


  const activeClassName = 'out-of-focus ' + (isActive ? 'active' : 'inactive');
  return (
    <div>
      <OrbitalControlPanel />

      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.warn(details);
        }}
      >
        {countriesPromise && <MapWrapper countriesPromise={countriesPromise} />}
      </ErrorBoundary>
      <div className={activeClassName}>
        <div className='inactive-message'>
          Polling Suspended
        </div>
      </div>

    </div>

  );
}