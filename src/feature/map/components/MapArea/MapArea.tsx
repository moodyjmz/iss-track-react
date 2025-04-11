import React, { useRef, useState, useEffect, useMemo, use, Suspense, useCallback } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchCurrentPosition } from '../../services/IssService';
import Position from '../Position';
import { usePolling } from '../../hooks/usePolling';
import ClosestCapital from '../ClosestCity';
import Loader from '../Loader/Loader';
import L from 'leaflet';
import iss from './iss.png';
import { useIsTabVisible } from '../../hooks/useIsTabVisible';

const issIcon = new L.Icon({
    iconUrl: iss,
    iconRetinaUrl: iss,
    popupAnchor: [-0, -0],
    iconSize: [64, 33],
});

const zoom = 5;

function DisplayPosition({ map, position }) {
    useEffect(() => {
        if (position && position.latitude) {
            map.setView([position.latitude, position.longitude], map.getZoom(), {
                animate: true
            });

        }
    }, [position, map]);

    return null;
}

function MapContainerWrapper({position, setMap, loadCallback}) {
    const handleLoad = useCallback(() => {
        loadCallback && loadCallback(true);
    }, [loadCallback]);
    return (<MapContainer
        center={[position.latitude, position.longitude]}
        zoom={zoom}
        scrollWheelZoom={false}
        ref={setMap}
        whenReady={handleLoad}
        style={{ height: '50vh' }}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.latitude, position.longitude]} icon={issIcon} />
    </MapContainer>);
}

function MapInner({ countries, currentPositionPromise, mapReady }) {
    const position = use(currentPositionPromise);
    const [map, setMap] = useState(null);

    const displayMap = useMemo(
        () => (
            position && <MapContainerWrapper setMap={setMap} loadCallback={mapReady} position={position}></MapContainerWrapper>
        ),
        [position]
    );

    return (
        <>
            {map && <DisplayPosition map={map} position={position} />}
            {displayMap}


            <Position position={position}></Position>
            <ClosestCapital countries={countries} position={position} />
        </>
    )
}

export default function MapArea({ countries }) {
    const currentPositionPromise = usePolling(fetchCurrentPosition, useIsTabVisible());
    const [mapReady, setMapReady] = useState(false);
    return (
        <div className='map-wrapper col'>
            {!mapReady && <Loader />}
            {currentPositionPromise && countries && <MapInner mapReady={setMapReady} countries={countries} currentPositionPromise={currentPositionPromise} />}
        </div>

    )
};
