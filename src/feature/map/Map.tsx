import MapArea from './components/MapArea/MapArea';
import FuturePass from './components/FuturePass';
import { use, Suspense } from 'react';
import { fetchCountries } from './services/CountriesService';
import { ErrorBoundary } from 'react-error-boundary';
import Loader from './components/Loader/Loader';
import { useAsyncData } from './hooks/useAsyncData';
import './map.css';

function MapWrapper({ countriesPromise }) {
    const countries = use(countriesPromise);
    return (
            <div className='app-inner'>
                    <MapArea countries={countries} />
                <div className='future-wrapper col'>
                    <Suspense fallback={<Loader />}>
                        <FuturePass countries={countries} />
                    </Suspense>
                </div>
            </div>
    );
}

function fallbackRender({ error, resetErrorBoundary }) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try Again</button>
        </div>
    );
}


export default function Map() {
    const countriesPromise = useAsyncData(fetchCountries);
    return (
        <>
            <ErrorBoundary
                fallbackRender={fallbackRender}
                onReset={(details) => {
                    console.warn(details);
                }}>

                {countriesPromise && <MapWrapper countriesPromise={countriesPromise} />}
            </ErrorBoundary>
        </>

    );
}
