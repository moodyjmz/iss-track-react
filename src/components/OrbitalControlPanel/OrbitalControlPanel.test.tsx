import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils';
import OrbitalControlPanel from './OrbitalControlPanel';
import { useOrbitalStore } from '../../stores/orbitalStore';

// Mock the orbital store
vi.mock('../../stores/orbitalStore');
const mockUseOrbitalStore = vi.mocked(useOrbitalStore);

describe('OrbitalControlPanel', () => {
  const mockActions = {
    toggleControlPanel: vi.fn(),
    toggleHistoricalTracking: vi.fn(),
    updateSettings: vi.fn(),
  };

  const defaultStoreState = {
    settings: {
      showHistoricalPath: true,
      showFuturePredictions: false,
      showGroundTrack: true,
      pathDuration: 2,
      predictionDuration: 1,
      updateInterval: 30000,
      pathOpacity: 0.7,
      pathColor: '#00ff00',
    },
    isControlPanelOpen: false,
    isHistoricalTrackingEnabled: false,
    isLoadingHistorical: false,
    isLoadingPredictions: false,
    ...mockActions,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOrbitalStore.mockReturnValue(defaultStoreState);
  });

  it('renders the control panel toggle button', () => {
    render(<OrbitalControlPanel />);

    const toggleButton = screen.getByTitle('Toggle Orbital Controls');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent('🛰️');
  });

  it('toggles control panel when button is clicked', () => {
    render(<OrbitalControlPanel />);

    const toggleButton = screen.getByTitle('Toggle Orbital Controls');
    fireEvent.click(toggleButton);

    expect(mockActions.toggleControlPanel).toHaveBeenCalledTimes(1);
  });

  it('shows control panel content when open', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
    });

    render(<OrbitalControlPanel />);

    expect(screen.getByText('Orbital Visualisation')).toBeInTheDocument();
    expect(screen.getByText('Enable Historical Tracking')).toBeInTheDocument();
  });

  it('hides control panel content when closed', () => {
    render(<OrbitalControlPanel />);

    expect(screen.queryByText('Orbital Visualisation')).not.toBeInTheDocument();
    expect(screen.queryByText('Enable Historical Tracking')).not.toBeInTheDocument();
  });

  it('toggles historical tracking when checkbox is clicked', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
    });

    render(<OrbitalControlPanel />);

    const checkbox = screen.getByLabelText('Enable Historical Tracking');
    fireEvent.click(checkbox);

    expect(mockActions.toggleHistoricalTracking).toHaveBeenCalledTimes(1);
  });

  it('shows additional controls when historical tracking is enabled', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
    });

    render(<OrbitalControlPanel />);

    expect(screen.getByText('Show Historical Path')).toBeInTheDocument();
    expect(screen.getByText('Show Future Predictions')).toBeInTheDocument();
    expect(screen.getByText('Show Ground Track')).toBeInTheDocument();
    expect(screen.getByText(/Historical Data Duration/)).toBeInTheDocument();
  });

  it('updates path duration setting', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
    });

    render(<OrbitalControlPanel />);

    const slider = screen.getByDisplayValue('2');
    fireEvent.change(slider, { target: { value: '4' } });

    expect(mockActions.updateSettings).toHaveBeenCalledWith({ pathDuration: 4 });
  });

  it('updates path opacity setting', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
    });

    render(<OrbitalControlPanel />);

    const opacitySlider = screen.getByDisplayValue('0.7');
    fireEvent.change(opacitySlider, { target: { value: '0.5' } });

    expect(mockActions.updateSettings).toHaveBeenCalledWith({ pathOpacity: 0.5 });
  });

  it('updates path color setting', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
    });

    render(<OrbitalControlPanel />);

    const colorInput = screen.getByDisplayValue('#00ff00');
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });

    expect(mockActions.updateSettings).toHaveBeenCalledWith({ pathColor: '#ff0000' });
  });

  it('updates color via preset dropdown', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
    });

    render(<OrbitalControlPanel />);

    const colorSelect = screen.getByDisplayValue('Green');
    fireEvent.change(colorSelect, { target: { value: '#0099ff' } });

    expect(mockActions.updateSettings).toHaveBeenCalledWith({ pathColor: '#0099ff' });
  });

  it('shows loading indicators when data is loading', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
      isLoadingHistorical: true,
      isLoadingPredictions: true,
    });

    render(<OrbitalControlPanel />);

    const loadingIndicators = screen.getAllByText('⏳');
    expect(loadingIndicators).toHaveLength(2);
  });

  it('closes panel when close button is clicked', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
    });

    render(<OrbitalControlPanel />);

    const closeButton = screen.getByTitle('Close panel');
    fireEvent.click(closeButton);

    expect(mockActions.toggleControlPanel).toHaveBeenCalledTimes(1);
  });

  it('toggles individual visualisation options', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
    });

    render(<OrbitalControlPanel />);

    const historicalPathCheckbox = screen.getByLabelText('Show Historical Path');
    fireEvent.click(historicalPathCheckbox);

    expect(mockActions.updateSettings).toHaveBeenCalledWith({ showHistoricalPath: false });

    const futurePathCheckbox = screen.getByLabelText('Show Future Predictions');
    fireEvent.click(futurePathCheckbox);

    expect(mockActions.updateSettings).toHaveBeenCalledWith({ showFuturePredictions: true });

    const groundTrackCheckbox = screen.getByLabelText('Show Ground Track');
    fireEvent.click(groundTrackCheckbox);

    expect(mockActions.updateSettings).toHaveBeenCalledWith({ showGroundTrack: false });
  });

  it('displays correct duration values in labels', () => {
    mockUseOrbitalStore.mockReturnValue({
      ...defaultStoreState,
      isControlPanelOpen: true,
      isHistoricalTrackingEnabled: true,
      settings: {
        ...defaultStoreState.settings,
        pathDuration: 3.5,
        predictionDuration: 2,
        updateInterval: 60000,
        pathOpacity: 0.8,
      },
    });

    render(<OrbitalControlPanel />);

    expect(screen.getByText('Historical Data Duration: 3.5 hours')).toBeInTheDocument();
    expect(screen.getByText('Prediction Duration: 2 hours')).toBeInTheDocument();
    expect(screen.getByText('Update Interval: 60s')).toBeInTheDocument();
    expect(screen.getByText('Path Opacity: 80%')).toBeInTheDocument();
  });
});