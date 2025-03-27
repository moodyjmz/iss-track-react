import React, { useRef, useState, useEffect, useMemo, use, Suspense } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useMap } from 'react-leaflet/hooks';
import "leaflet/dist/leaflet.css";
import { fetchCurrentPosition } from '../../services/IssService';
import Position from '../Position';
import { usePolling } from '../../hooks/usePolling';
import ClosestCity from '../ClosestCity';
import { logger } from '../../utils/logger';
import Loader from '../Loader/Loader';
import L from 'leaflet';
import iss from './iss.png';

const issIcon = new L.Icon({
    iconUrl: iss,
    iconRetinaUrl: iss,
    popupAnchor:  [-0, -0],
    iconSize: [64,33],     
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

function MapInner({ countries, currentPositionPromise }) {
    const position = use(currentPositionPromise);

    const [map, setMap] = useState(null);
    const handleMapLoad = (e) => {
        console.log('handleMapLoad', e);
    }
    const displayMap = useMemo(
        () => (
            <MapContainer
                center={[position.latitude, position.longitude]}
                zoom={zoom}
                scrollWheelZoom={false}
                ref={setMap}
                whenReady={handleMapLoad}
                style={{ height: '50vh' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[position.latitude, position.longitude]} icon={issIcon} />
            </MapContainer>
        ),
        [position]
    );
    return (
        <>
            {map && <DisplayPosition map={map} position={position} />}
            {displayMap}
            

            <Position position={position}></Position>
            <ClosestCity countries={countries} position={position} />
        </>
    )
}

export default function MapArea({ countries }) {
    const currentPositionPromise = usePolling(fetchCurrentPosition);
    return (
        <div className='map-wrapper col'>
            {currentPositionPromise && countries && <MapInner countries={countries} currentPositionPromise={currentPositionPromise} />}
        </div>
    )
};
