import React, { useState, useEffect, useMemo, use, useCallback } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchCurrentTelemetry } from '../../services/IssService';
import Position from '../Position';
import { usePolling } from '../../hooks/usePolling';
import ClosestCapital from '../ClosestCity';
import Loader from '../Loader/Loader';
import L from 'leaflet';
import iss from './iss.png';
import { useIsTabVisible } from '../../hooks/useIsTabVisible';
import { Country } from '../../defs/country';
import { Coordinates } from '../../defs/coordinates';
import { getClosestCapital } from '../../utils/countries/getClosestCapital';
import ValueDisplay from '../ValueDisplay';

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
    currentTelemetryPromise: Promise<IS>;
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

function MapContainerWrapper({ position, setMap, loadCallback }: MapContainerWrapperProps) {
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
            <Marker position={[position.latitude, position.longitude]} icon={issIcon} />
        </MapContainer>
    );
}

function MapInner({ countries, currentTelemetryPromise, mapReady }: MapInnerProps) {
    const position = use(currentTelemetryPromise);
    const closestCityName = getClosestCapital({ countries, position });
    console.log(closestCityName);
    const [map, setMap] = useState<L.Map | null>(null);

    const displayMap = useMemo(
        () => (
            position && <MapContainerWrapper setMap={setMap} loadCallback={mapReady} position={position}></MapContainerWrapper>
        ),
        [position, mapReady]
    );

    return (
        <>
            {map && <DisplayPosition map={map} position={position} />}
            {displayMap}
            <ValueDisplay value={position.latitude} title='Latitude' />
            <ValueDisplay value={position.longitude} title='Longitude' />
            <ClosestCapital countries={countries} position={position} />
        </>
    );
}

export default function MapArea({ countries }: MapAreaProps) {
    const currentTelemetryPromise = usePolling(fetchCurrentTelemetry, useIsTabVisible());
    const [mapReady, setMapReady] = useState(false);

    return (
        <div className='map-wrapper col'>
            {!mapReady && <Loader />}
            {currentTelemetryPromise && countries && <MapInner mapReady={setMapReady} countries={countries} currentTelemetryPromise={currentTelemetryPromise} />}
        </div>
    );
}