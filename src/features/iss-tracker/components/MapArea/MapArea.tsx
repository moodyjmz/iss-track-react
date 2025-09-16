import React, { useState, useEffect, useMemo, use, useCallback, memo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchCurrentTelemetry } from '@services/IssService';
import { usePolling } from '@hooks/usePolling';
import Loader from '../Loader/Loader';
import L from 'leaflet';
import iss from './iss.png';
import { getClosestCapital } from '@utils/countries/getClosestCapital';
import ValueDisplay from '../ValueDisplay';
import { WindowStateContext } from '@context/WindowState';
import OrbitalVisualization from '../OrbitalPath/OrbitalPath';
import { useOrbitalData } from '@hooks/useOrbitalData';

interface DisplayPositionProps {
    map: L.Map;
    position: Coordinates;
}

interface MapContainerWrapperProps {
    position: Coordinates;
    setMap: React.Dispatch<React.SetStateAction<L.Map | null>>;
    loadCallback?: (ready: boolean) => void;
}

interface MapInnerProps {
    countries: Country[];
    currentTelemetryPromise: Promise<ISSStats>;
    mapReady: (ready: boolean) => void;
}

// Define types for MapArea props
interface MapAreaProps {
    countries: Country[];
}

const issIcon = new L.Icon({
    iconUrl: iss,
    iconRetinaUrl: iss,
    popupAnchor: [-0, -0],
    iconSize: [64, 33],
});

const zoom = 5;

function DisplayPosition({ map, position }: DisplayPositionProps) {
    useEffect(() => {
        if (position && position.latitude) {
            map.setView([position.latitude, position.longitude], map.getZoom(), {
                animate: true
            });
        }
    }, [position, map]);

    return null;
}

const MapContainerWrapper = memo(function MapContainerWrapper({ position, setMap, loadCallback }: MapContainerWrapperProps) {
    const handleLoad = useCallback(() => {
        loadCallback && loadCallback(true);
    }, [loadCallback]);

    return (
        <MapContainer
            center={[position.latitude, position.longitude]}
            zoom={zoom}
            scrollWheelZoom={false}
            ref={setMap}
            whenReady={handleLoad}
            style={{ height: '50vh' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <OrbitalVisualization />
            <Marker position={[position.latitude, position.longitude]} icon={issIcon} />
        </MapContainer>
    );
});

function MapInner({ countries, currentTelemetryPromise, mapReady }: MapInnerProps) {
    const telemetry = use(currentTelemetryPromise);

    // Handle case where telemetry is undefined or API failed or using fallback data
    if (!telemetry || !telemetry.units || telemetry.isFallbackData) {
        return (
            <div className='col'>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h3>🛰️ ISS Tracking Server Unreachable</h3>
                    <p>Cannot connect to the ISS tracking service.</p>
                    <p style={{ fontSize: '0.9em', color: '#666' }}>
                        The server at wheretheiss.at appears to be down or unreachable.
                        <br />
                        This is typically a temporary connectivity issue.
                        <br />
                        Please check your internet connection and try refreshing the page.
                    </p>
                </div>
            </div>
        );
    }

    const closestCityName = useMemo(() =>
        getClosestCapital({ countries, position: telemetry }),
        [countries, telemetry]
    );
    const [map, setMap] = useState<L.Map | null>(null);
    const unit = useMemo(() =>
        telemetry.units.slice(0, -1) + '-per-hour',
        [telemetry.units]
    );

    // Initialize orbital data hook
    const { updateCurrentPosition } = useOrbitalData();

    // Update orbital store when telemetry changes
    useEffect(() => {
        if (telemetry) {
            updateCurrentPosition(telemetry);
        }
    }, [telemetry, updateCurrentPosition]);
    const displayMap = useMemo(
        () => (
            telemetry && <MapContainerWrapper setMap={setMap} loadCallback={mapReady} position={telemetry}></MapContainerWrapper>
        ),
        [telemetry, mapReady]
    );

    return (
        <>
            {map && <DisplayPosition map={map} position={telemetry} />}
            <div className='map-wrapper'>
                {displayMap}
            </div>
            <div className='grid'>
                <div className="item left top">
                    <div className="content-wrapper">
                        <div className="content">
                            <ValueDisplay value={telemetry.latitude} title='Latitude' decimalPlaces={4} />
                        </div>
                    </div>
                </div>
                <div className="item right top">
                    <div className="content-wrapper">
                        <div className="content">
                            <ValueDisplay value={telemetry.longitude} title='Longitude' decimalPlaces={4} />
                        </div>
                    </div>
                </div>
                <div className="item left bottom">
                    <div className="content-wrapper">
                        <div className="content">
                            <ValueDisplay value={telemetry.velocity} title='Velocity' decimalPlaces={0} unit={unit} />
                        </div>
                    </div>
                </div>
                <div className="item right bottom">
                    <div className="content-wrapper">
                        <div className="content">
                            {closestCityName && <ValueDisplay value={closestCityName} title='Closest Capital' />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function MapArea({ countries }: MapAreaProps) {
    const windowStateContext = use(WindowStateContext);
    const { isActive } = windowStateContext;
    const currentTelemetryPromise = usePolling(fetchCurrentTelemetry, isActive);
    const [mapReady, setMapReady] = useState(false);
    return (

        <div className='col'>
            {!mapReady && <Loader />}
            {currentTelemetryPromise && countries && <MapInner mapReady={setMapReady} countries={countries} currentTelemetryPromise={currentTelemetryPromise} />}
        </div>
    );
}