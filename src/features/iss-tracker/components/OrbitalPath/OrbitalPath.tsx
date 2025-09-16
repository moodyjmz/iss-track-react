import React, { useMemo, useCallback, memo } from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { useOrbitalStore, type OrbitalPosition } from '@stores/orbitalStore';

interface OrbitalPathProps {
  positions: OrbitalPosition[];
  color: string;
  opacity: number;
  isHistorical?: boolean;
}

const OrbitalPath: React.FC<OrbitalPathProps> = memo(({
  positions,
  color,
  opacity,
  isHistorical = false
}) => {
  // Convert positions to Leaflet LatLng format
  const pathCoordinates = useMemo((): LatLngExpression[] => {
    return positions.map(pos => [pos.latitude, pos.longitude] as LatLngExpression);
  }, [positions]);

  // Create markers for significant positions (every 10th position to avoid clutter)
  const significantPositions = useMemo(() => {
    return positions.filter((_, index) => index % 10 === 0);
  }, [positions]);

  const formatTime = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  }, []);

  const formatDate = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  }, []);

  if (pathCoordinates.length < 2) {
    return null;
  }

  return (
    <>
      {/* Main orbital path */}
      <Polyline
        key={`path-${color}-${opacity}-${positions.length}`}
        positions={pathCoordinates}
        color={color}
        opacity={opacity}
        weight={isHistorical ? 5 : 2}
        dashArray={isHistorical ? undefined : "5, 10"}
      />

      {/* Position markers */}
      {significantPositions.map((position, index) => (
        <CircleMarker
          key={`marker-${position.timestamp}-${index}-${color}-${opacity}`}
          center={[position.latitude, position.longitude]}
          radius={4}
          color={color}
          fillColor={color}
          fillOpacity={0.8}
          opacity={opacity}
          weight={1}
        >
          <Tooltip>
            <div>
              <strong>{isHistorical ? 'Historical' : 'Predicted'} Position</strong>
              <br />
              Time: {formatTime(position.timestamp)}
              <br />
              Date: {formatDate(position.timestamp)}
              <br />
              Lat: {position.latitude.toFixed(4)}°
              <br />
              Lng: {position.longitude.toFixed(4)}°
              <br />
              Alt: {position.altitude.toFixed(2)} km
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
});

/**
 * Ground track visualisation component
 */
interface GroundTrackProps {
  currentPosition: OrbitalPosition | null;
  color: string;
  opacity: number;
}

const GroundTrack: React.FC<GroundTrackProps> = memo(({
  currentPosition,
  color,
  opacity
}) => {
  if (!currentPosition) return null;

  // Simple ground track approximation
  // In reality, this would require complex orbital mechanics calculations
  const groundTrackPoints = useMemo((): LatLngExpression[] => {
    const points: LatLngExpression[] = [];
    const startLng = currentPosition.longitude;

    // Approximate ISS ground track (moves west to east)
    for (let i = -180; i <= 180; i += 5) {
      // Simplified sine wave pattern for ground track
      const lat = Math.sin((i * Math.PI) / 180) * 51.6; // ISS max latitude ~51.6°
      points.push([lat, i] as LatLngExpression);
    }

    return points;
  }, [currentPosition]);

  return (
    <Polyline
      key={`ground-track-line-${color}-${opacity}`}
      positions={groundTrackPoints}
      color={color}
      opacity={opacity * 0.5}
      weight={1}
      dashArray="2, 4"
    />
  );
});

/**
 * Main orbital visualisation container component
 */
export default function OrbitalVisualization() {
  const {
    settings,
    currentPosition,
    historicalPositions,
    futurePredictions,
    isHistoricalTrackingEnabled,
  } = useOrbitalStore();

  if (!isHistoricalTrackingEnabled) {
    return null;
  }

  return (
    <>
      {/* Historical path */}
      {settings.showHistoricalPath && historicalPositions.length > 0 && (
        <OrbitalPath
          key={`historical-${settings.pathColor}-${settings.pathOpacity}-${historicalPositions.length}`}
          positions={historicalPositions}
          color={settings.pathColor}
          opacity={settings.pathOpacity}
          isHistorical={true}
        />
      )}

      {/* Future predictions */}
      {settings.showFuturePredictions && futurePredictions.length > 0 && (
        <OrbitalPath
          key={`predictions-${settings.pathColor}-${settings.pathOpacity}-${futurePredictions.length}`}
          positions={futurePredictions}
          color={settings.pathColor}
          opacity={settings.pathOpacity * 0.7}
          isHistorical={false}
        />
      )}

      {/* Ground track */}
      {settings.showGroundTrack && (
        <GroundTrack
          key={`ground-track-${settings.pathColor}-${settings.pathOpacity}`}
          currentPosition={currentPosition ? {
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            altitude: currentPosition.altitude,
            timestamp: new Date(currentPosition.timestamp).getTime(),
          } : {
            latitude: 0,
            longitude: 0,
            altitude: 408,
            timestamp: Date.now()
          }}
          color={settings.pathColor}
          opacity={settings.pathOpacity}
        />
      )}
    </>
  );
}