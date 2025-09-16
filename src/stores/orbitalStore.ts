import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface OrbitalPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
  velocity?: number;
}

export interface OrbitalSettings {
  showHistoricalPath: boolean;
  showFuturePredictions: boolean;
  showGroundTrack: boolean;
  pathDuration: number; // hours of historical data to show
  predictionDuration: number; // hours of future predictions
  updateInterval: number; // milliseconds
  pathOpacity: number; // 0-1
  pathColor: string;
}

export interface OrbitalVisualizationState {
  // Settings
  settings: OrbitalSettings;
  isControlPanelOpen: boolean;
  isHistoricalTrackingEnabled: boolean;

  // Data
  currentPosition: ISSStats | null;
  historicalPositions: OrbitalPosition[];
  futurePredictions: OrbitalPosition[];

  // Loading states
  isLoadingHistorical: boolean;
  isLoadingPredictions: boolean;

  // Actions
  toggleControlPanel: () => void;
  toggleHistoricalTracking: () => void;
  updateSettings: (settings: Partial<OrbitalSettings>) => void;
  setCurrentPosition: (position: ISSStats | null) => void;
  setHistoricalPositions: (positions: OrbitalPosition[]) => void;
  setFuturePredictions: (positions: OrbitalPosition[]) => void;
  setLoadingHistorical: (loading: boolean) => void;
  setLoadingPredictions: (loading: boolean) => void;
  resetVisualisation: () => void;
}

const DEFAULT_SETTINGS: OrbitalSettings = {
  showHistoricalPath: true,
  showFuturePredictions: false,
  showGroundTrack: true,
  pathDuration: 2, // 2 hours of historical data
  predictionDuration: 1, // 1 hour of predictions
  updateInterval: 30000, // 30 seconds
  pathOpacity: 0.7,
  pathColor: '#00ff00', // Green for orbital path
};

export const useOrbitalStore = create<OrbitalVisualizationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      settings: DEFAULT_SETTINGS,
      isControlPanelOpen: false,
      isHistoricalTrackingEnabled: false,

      currentPosition: null,
      historicalPositions: [],
      futurePredictions: [],

      isLoadingHistorical: false,
      isLoadingPredictions: false,

      // Actions
      toggleControlPanel: () =>
        set((state) => ({ isControlPanelOpen: !state.isControlPanelOpen })),

      toggleHistoricalTracking: () =>
        set((state) => ({
          isHistoricalTrackingEnabled: !state.isHistoricalTrackingEnabled,
          // Clear data when disabling
          ...(!state.isHistoricalTrackingEnabled ? {} : {
            historicalPositions: [],
            futurePredictions: []
          })
        })),

      updateSettings: (newSettings: Partial<OrbitalSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      setCurrentPosition: (position: ISSStats | null) =>
        set({ currentPosition: position }),

      setHistoricalPositions: (positions: OrbitalPosition[]) =>
        set({ historicalPositions: positions }),

      setFuturePredictions: (positions: OrbitalPosition[]) =>
        set({ futurePredictions: positions }),

      setLoadingHistorical: (loading: boolean) =>
        set({ isLoadingHistorical: loading }),

      setLoadingPredictions: (loading: boolean) =>
        set({ isLoadingPredictions: loading }),

      resetVisualisation: () =>
        set({
          historicalPositions: [],
          futurePredictions: [],
          isLoadingHistorical: false,
          isLoadingPredictions: false
        }),
    }),
    { name: 'orbital-visualisation' }
  )
);