import { use, Suspense, JSX, useEffect } from 'react';
import { fetchCountries } from './services/CountriesService';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useAsyncData } from './hooks/useAsyncData';
import './map.css';
import { MapWrapper } from './components/MapWrapper';
import { WindowStateContext, WindowStateProvider } from './context/WindowState';
import { useIsPageFocused } from './hooks/useIsPageFocused';

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
  const isPageActive = useIsPageFocused();
  const windowStateContext = use(WindowStateContext);
  const countriesPromise = useAsyncData(fetchCountries);

  const { isActive, setIsActive } = windowStateContext;
  useEffect(() => {
    setIsActive(isPageActive);
  });
  const activeClassName = 'out-of-focus ' + (isActive ? 'active' : 'inactive');
  console.log(activeClassName);
  return (
    <div>

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