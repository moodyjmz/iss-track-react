import { describe, it, expect, beforeEach } from 'vitest';
import { useOrbitalStore } from './orbitalStore';
import type { OrbitalPosition, OrbitalSettings } from './orbitalStore';

describe('orbitalStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useOrbitalStore.getState().resetVisualisation();
    useOrbitalStore.setState({
      isControlPanelOpen: false,
      isHistoricalTrackingEnabled: false,
      settings: {
        showHistoricalPath: true,
        showFuturePredictions: false,
        showGroundTrack: true,
        pathDuration: 2,
        predictionDuration: 1,
        updateInterval: 30000,
        pathOpacity: 0.7,
        pathColor: '#00ff00',
      }
    });
  });

  it('initializes with default state', () => {
    const state = useOrbitalStore.getState();

    expect(state.isControlPanelOpen).toBe(false);
    expect(state.isHistoricalTrackingEnabled).toBe(false);
    expect(state.currentPosition).toBe(null);
    expect(state.historicalPositions).toEqual([]);
    expect(state.futurePredictions).toEqual([]);
    expect(state.isLoadingHistorical).toBe(false);
    expect(state.isLoadingPredictions).toBe(false);
  });

  it('toggles control panel state', () => {
    const { toggleControlPanel } = useOrbitalStore.getState();

    expect(useOrbitalStore.getState().isControlPanelOpen).toBe(false);

    toggleControlPanel();
    expect(useOrbitalStore.getState().isControlPanelOpen).toBe(true);

    toggleControlPanel();
    expect(useOrbitalStore.getState().isControlPanelOpen).toBe(false);
  });

  it('toggles historical tracking and clears data when disabled', () => {
    const { toggleHistoricalTracking, setHistoricalPositions, setFuturePredictions } = useOrbitalStore.getState();

    // Add some test data
    const testPositions: OrbitalPosition[] = [
      { latitude: 51.5, longitude: 0, altitude: 408, timestamp: Date.now() }
    ];
    setHistoricalPositions(testPositions);
    setFuturePredictions(testPositions);

    expect(useOrbitalStore.getState().isHistoricalTrackingEnabled).toBe(false);

    // Enable tracking
    toggleHistoricalTracking();
    expect(useOrbitalStore.getState().isHistoricalTrackingEnabled).toBe(true);

    // Disable tracking - should clear data
    toggleHistoricalTracking();
    expect(useOrbitalStore.getState().isHistoricalTrackingEnabled).toBe(false);
    expect(useOrbitalStore.getState().historicalPositions).toEqual([]);
    expect(useOrbitalStore.getState().futurePredictions).toEqual([]);
  });

  it('updates settings correctly', () => {
    const { updateSettings } = useOrbitalStore.getState();

    const newSettings: Partial<OrbitalSettings> = {
      pathDuration: 4,
      pathColor: '#ff0000',
      showFuturePredictions: true,
    };

    updateSettings(newSettings);
    const state = useOrbitalStore.getState();

    expect(state.settings.pathDuration).toBe(4);
    expect(state.settings.pathColor).toBe('#ff0000');
    expect(state.settings.showFuturePredictions).toBe(true);
    // Other settings should remain unchanged
    expect(state.settings.showHistoricalPath).toBe(true);
    expect(state.settings.pathOpacity).toBe(0.7);
  });

  it('manages current position', () => {
    const { setCurrentPosition } = useOrbitalStore.getState();

    const mockPosition = {
      name: 'iss',
      id: 25544,
      latitude: 51.5074,
      longitude: -0.1278,
      altitude: 408.45,
      velocity: 27.6,
      visibility: 'daylight' as const,
      footprint: 4621.8,
      timestamp: new Date(),
      daynum: 2460310.0,
      solar_lat: -23.1,
      solar_lon: 123.4,
      units: 'kilometers' as const,
    };

    setCurrentPosition(mockPosition);
    expect(useOrbitalStore.getState().currentPosition).toEqual(mockPosition);

    setCurrentPosition(null);
    expect(useOrbitalStore.getState().currentPosition).toBe(null);
  });

  it('manages historical positions', () => {
    const { setHistoricalPositions } = useOrbitalStore.getState();

    const positions: OrbitalPosition[] = [
      { latitude: 51.5, longitude: 0, altitude: 408, timestamp: Date.now() },
      { latitude: 48.8, longitude: 2.3, altitude: 410, timestamp: Date.now() + 1000 },
    ];

    setHistoricalPositions(positions);
    expect(useOrbitalStore.getState().historicalPositions).toEqual(positions);
  });

  it('manages future predictions', () => {
    const { setFuturePredictions } = useOrbitalStore.getState();

    const predictions: OrbitalPosition[] = [
      { latitude: 40.7, longitude: -74, altitude: 412, timestamp: Date.now() + 60000 },
      { latitude: 35.6, longitude: 139.6, altitude: 415, timestamp: Date.now() + 120000 },
    ];

    setFuturePredictions(predictions);
    expect(useOrbitalStore.getState().futurePredictions).toEqual(predictions);
  });

  it('manages loading states', () => {
    const { setLoadingHistorical, setLoadingPredictions } = useOrbitalStore.getState();

    expect(useOrbitalStore.getState().isLoadingHistorical).toBe(false);
    expect(useOrbitalStore.getState().isLoadingPredictions).toBe(false);

    setLoadingHistorical(true);
    setLoadingPredictions(true);

    expect(useOrbitalStore.getState().isLoadingHistorical).toBe(true);
    expect(useOrbitalStore.getState().isLoadingPredictions).toBe(true);

    setLoadingHistorical(false);
    setLoadingPredictions(false);

    expect(useOrbitalStore.getState().isLoadingHistorical).toBe(false);
    expect(useOrbitalStore.getState().isLoadingPredictions).toBe(false);
  });

  it('resets visualisation data', () => {
    const {
      setHistoricalPositions,
      setFuturePredictions,
      setLoadingHistorical,
      setLoadingPredictions,
      resetVisualisation
    } = useOrbitalStore.getState();

    // Set up some test data
    const positions: OrbitalPosition[] = [
      { latitude: 51.5, longitude: 0, altitude: 408, timestamp: Date.now() }
    ];

    setHistoricalPositions(positions);
    setFuturePredictions(positions);
    setLoadingHistorical(true);
    setLoadingPredictions(true);

    // Reset should clear everything
    resetVisualisation();

    const state = useOrbitalStore.getState();
    expect(state.historicalPositions).toEqual([]);
    expect(state.futurePredictions).toEqual([]);
    expect(state.isLoadingHistorical).toBe(false);
    expect(state.isLoadingPredictions).toBe(false);
  });

  it('validates default settings', () => {
    const { settings } = useOrbitalStore.getState();

    expect(settings.showHistoricalPath).toBe(true);
    expect(settings.showFuturePredictions).toBe(false);
    expect(settings.showGroundTrack).toBe(true);
    expect(settings.pathDuration).toBe(2);
    expect(settings.predictionDuration).toBe(1);
    expect(settings.updateInterval).toBe(30000);
    expect(settings.pathOpacity).toBe(0.7);
    expect(settings.pathColor).toBe('#00ff00');
  });
});