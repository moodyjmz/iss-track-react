import { useEffect, useRef, useCallback } from 'react';
import { useOrbitalStore } from '@stores/orbitalStore';
import { OrbitalDataService } from '@services/OrbitalDataService';

export function useOrbitalData() {
  const {
    settings,
    isHistoricalTrackingEnabled,
    currentPosition,
    setCurrentPosition,
    setHistoricalPositions,
    setFuturePredictions,
    setLoadingHistorical,
    setLoadingPredictions,
    resetVisualisation,
  } = useOrbitalStore();

  const orbitalService = useRef(new OrbitalDataService());
  const historicalAbortController = useRef<AbortController | null>(null);
  const predictionsAbortController = useRef<AbortController | null>(null);
  const updateInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch historical positions
  const fetchHistoricalData = useCallback(async () => {
    if (!isHistoricalTrackingEnabled || !settings.showHistoricalPath) {
      return;
    }

    // Cancel any existing request
    if (historicalAbortController.current) {
      historicalAbortController.current.abort();
    }

    historicalAbortController.current = new AbortController();
    setLoadingHistorical(true);

    try {
      const positions = await orbitalService.current.getHistoricalPositions(
        settings.pathDuration,
        'kilometers',
        historicalAbortController.current.signal
      );

      if (!historicalAbortController.current.signal.aborted) {
        setHistoricalPositions(positions);
      }
    } catch (error) {
      if (!historicalAbortController.current?.signal.aborted) {
        console.error('Failed to fetch historical positions:', error);
        setHistoricalPositions([]);
      }
    } finally {
      if (!historicalAbortController.current?.signal.aborted) {
        setLoadingHistorical(false);
      }
    }
  }, [
    isHistoricalTrackingEnabled,
    settings.showHistoricalPath,
    settings.pathDuration,
    setHistoricalPositions,
    setLoadingHistorical
  ]);

  // Fetch future predictions
  const fetchPredictionData = useCallback(async () => {
    if (!isHistoricalTrackingEnabled || !settings.showFuturePredictions) return;

    // Cancel any existing request
    if (predictionsAbortController.current) {
      predictionsAbortController.current.abort();
    }

    predictionsAbortController.current = new AbortController();
    setLoadingPredictions(true);

    try {
      const positions = await orbitalService.current.getFuturePositions(
        settings.predictionDuration,
        'kilometers',
        predictionsAbortController.current.signal
      );

      if (!predictionsAbortController.current.signal.aborted) {
        setFuturePredictions(positions);
      }
    } catch (error) {
      if (!predictionsAbortController.current?.signal.aborted) {
        console.error('Failed to fetch future predictions:', error);
        setFuturePredictions([]);
      }
    } finally {
      if (!predictionsAbortController.current?.signal.aborted) {
        setLoadingPredictions(false);
      }
    }
  }, [
    isHistoricalTrackingEnabled,
    settings.showFuturePredictions,
    settings.predictionDuration,
    setFuturePredictions,
    setLoadingPredictions
  ]);

  // Update data when current position changes
  const handleCurrentPositionUpdate = useCallback((newPosition: ISSStats | null) => {
    setCurrentPosition(newPosition);

    // Only fetch orbital data if historical tracking is enabled
    if (isHistoricalTrackingEnabled) {
      fetchHistoricalData();
      fetchPredictionData();
    }
  }, [isHistoricalTrackingEnabled, fetchHistoricalData, fetchPredictionData, setCurrentPosition]);

  // Set up periodic updates
  useEffect(() => {
    if (!isHistoricalTrackingEnabled) {
      // Clear any existing interval
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
        updateInterval.current = null;
      }
      return;
    }

    // Initial data fetch
    fetchHistoricalData();
    fetchPredictionData();

    // Set up periodic updates
    updateInterval.current = setInterval(() => {
      fetchHistoricalData();
      fetchPredictionData();
    }, settings.updateInterval);

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
        updateInterval.current = null;
      }
    };
  }, [
    isHistoricalTrackingEnabled,
    settings.updateInterval,
    fetchHistoricalData,
    fetchPredictionData
  ]);

  // Handle settings changes
  useEffect(() => {
    if (!isHistoricalTrackingEnabled) return;

    // Refetch data when relevant settings change
    const settingsRequiringRefetch = [
      settings.pathDuration,
      settings.predictionDuration,
      settings.showHistoricalPath,
      settings.showFuturePredictions,
    ];

    fetchHistoricalData();
    fetchPredictionData();
  }, [
    settings.pathDuration,
    settings.predictionDuration,
    settings.showHistoricalPath,
    settings.showFuturePredictions,
    fetchHistoricalData,
    fetchPredictionData,
    isHistoricalTrackingEnabled
  ]);

  // Clean up when historical tracking is disabled
  useEffect(() => {
    if (!isHistoricalTrackingEnabled) {
      resetVisualisation();

      // Cancel any ongoing requests
      if (historicalAbortController.current) {
        historicalAbortController.current.abort();
        historicalAbortController.current = null;
      }
      if (predictionsAbortController.current) {
        predictionsAbortController.current.abort();
        predictionsAbortController.current = null;
      }
    }
  }, [isHistoricalTrackingEnabled, resetVisualisation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
      if (historicalAbortController.current) {
        historicalAbortController.current.abort();
      }
      if (predictionsAbortController.current) {
        predictionsAbortController.current.abort();
      }
    };
  }, []);

  return {
    updateCurrentPosition: handleCurrentPositionUpdate,
    refetchHistorical: fetchHistoricalData,
    refetchPredictions: fetchPredictionData,
  };
}