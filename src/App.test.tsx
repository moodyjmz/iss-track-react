import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from './test/utils';
import App from './App';
import { mockFetch, createMockResponse, mockCountries } from './test/utils';

// Mock the Map component to avoid Leaflet dependencies in tests
vi.mock('./features/iss-tracker/Map', () => ({
  default: () => <div data-testid="iss-map">ISS Map Component</div>,
}));

describe('App', () => {
  beforeEach(() => {
    mockFetch(() => Promise.resolve(createMockResponse(mockCountries)));
  });

  it('renders the app wrapper', () => {
    render(<App />);

    const appWrapper = document.querySelector('.app-wrapper');
    expect(appWrapper).toBeInTheDocument();
  });

  it('renders the ISS map component', () => {
    render(<App />);

    const mapComponent = screen.getByTestId('iss-map');
    expect(mapComponent).toBeInTheDocument();
  });

  it('provides window state context', () => {
    render(<App />);

    // The component should render without throwing errors about missing context
    expect(screen.getByTestId('iss-map')).toBeInTheDocument();
  });
});
