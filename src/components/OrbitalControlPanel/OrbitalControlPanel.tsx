import React, { useCallback } from 'react';
import { useOrbitalStore } from '@stores/orbitalStore';
import './OrbitalControlPanel.css';

export default function OrbitalControlPanel() {
  const {
    settings,
    isControlPanelOpen,
    isHistoricalTrackingEnabled,
    isLoadingHistorical,
    isLoadingPredictions,
    toggleControlPanel,
    toggleHistoricalTracking,
    updateSettings,
  } = useOrbitalStore();

  const handlePathDurationChange = useCallback((duration: number) => {
    updateSettings({ pathDuration: duration });
  }, [updateSettings]);

  const handlePredictionDurationChange = useCallback((duration: number) => {
    updateSettings({ predictionDuration: duration });
  }, [updateSettings]);

  const handleOpacityChange = useCallback((opacity: number) => {
    updateSettings({ pathOpacity: opacity });
  }, [updateSettings]);

  const handleColorChange = useCallback((color: string) => {
    updateSettings({ pathColor: color });
  }, [updateSettings]);

  const handleUpdateIntervalChange = useCallback((interval: number) => {
    updateSettings({ updateInterval: interval });
  }, [updateSettings]);

  return (
    <div className="orbital-control-panel">
      <button
        className="control-panel-toggle"
        onClick={toggleControlPanel}
        title="Toggle Orbital Controls"
      >
        🛰️
      </button>

      {isControlPanelOpen && (
        <div className="control-panel-content">
          <div className="control-panel-header">
            <h3>Orbital Visualisation</h3>
            <button
              className="close-panel"
              onClick={toggleControlPanel}
              title="Close panel"
            >
              ×
            </button>
          </div>

          <div className="control-section">
            <div className="control-group">
              <label className="control-label">
                <input
                  type="checkbox"
                  checked={isHistoricalTrackingEnabled}
                  onChange={toggleHistoricalTracking}
                />
                Enable Historical Tracking
              </label>
            </div>

            {isHistoricalTrackingEnabled && (
              <>
                <div className="control-group">
                  <label className="control-label">
                    <input
                      type="checkbox"
                      checked={settings.showHistoricalPath}
                      onChange={(e) => updateSettings({ showHistoricalPath: e.target.checked })}
                    />
                    Show Historical Path
                    {isLoadingHistorical && <span className="loading-indicator">⏳</span>}
                  </label>
                </div>

                <div className="control-group">
                  <label className="control-label">
                    <input
                      type="checkbox"
                      checked={settings.showFuturePredictions}
                      onChange={(e) => updateSettings({ showFuturePredictions: e.target.checked })}
                    />
                    Show Future Predictions
                    {isLoadingPredictions && <span className="loading-indicator">⏳</span>}
                  </label>
                </div>

                <div className="control-group">
                  <label className="control-label">
                    <input
                      type="checkbox"
                      checked={settings.showGroundTrack}
                      onChange={(e) => updateSettings({ showGroundTrack: e.target.checked })}
                    />
                    Show Ground Track
                  </label>
                </div>

                <div className="control-group">
                  <label className="control-label">
                    Historical Data Duration: {settings.pathDuration} hours
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={settings.pathDuration}
                    onChange={(e) => handlePathDurationChange(Number(e.target.value))}
                    className="control-slider"
                  />
                </div>

                <div className="control-group">
                  <label className="control-label">
                    Prediction Duration: {settings.predictionDuration} hours
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="6"
                    step="0.5"
                    value={settings.predictionDuration}
                    onChange={(e) => handlePredictionDurationChange(Number(e.target.value))}
                    className="control-slider"
                  />
                </div>

                <div className="control-group">
                  <label className="control-label">
                    Path Opacity: {Math.round(settings.pathOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.pathOpacity}
                    onChange={(e) => handleOpacityChange(Number(e.target.value))}
                    className="control-slider"
                  />
                </div>

                <div className="control-group">
                  <label className="control-label">
                    Path Colour
                  </label>
                  <div className="color-controls">
                    <input
                      type="color"
                      value={settings.pathColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="color-picker"
                    />
                    <select
                      value={settings.pathColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="color-presets"
                    >
                      <option value="#00ff00">Green</option>
                      <option value="#0099ff">Blue</option>
                      <option value="#ff6600">Orange</option>
                      <option value="#ff0066">Pink</option>
                      <option value="#ffff00">Yellow</option>
                      <option value="#9966ff">Purple</option>
                    </select>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">
                    Update Interval: {settings.updateInterval / 1000}s
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="120000"
                    step="5000"
                    value={settings.updateInterval}
                    onChange={(e) => handleUpdateIntervalChange(Number(e.target.value))}
                    className="control-slider"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}