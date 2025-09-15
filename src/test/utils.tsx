import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { WindowStateProvider } from '../context/WindowState';

/**
 * Custom render function that includes common providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WindowStateProvider>
      {children}
    </WindowStateProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

/**
 * Mock API response helper
 */
export const createMockResponse = <T,>(data: T): Response => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * Mock fetch helper
 */
export const mockFetch = (mockImplementation: any) => {
  (global.fetch as any).mockImplementation(mockImplementation);
};

/**
 * Create mock promise that resolves after a delay
 */
export const createDelayedPromise = <T,>(data: T, delay = 100): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

/**
 * Mock coordinates data
 */
export const mockCoordinates = {
  latitude: 51.5074,
  longitude: -0.1278,
};

/**
 * Mock ISS stats data
 */
export const mockISSStats = {
  name: 'iss',
  id: 25544,
  latitude: 45.2346,
  longitude: -93.8654,
  altitude: 408.45,
  velocity: 27.6,
  visibility: 'daylight' as const,
  footprint: 4621.8,
  timestamp: new Date('2024-01-01T12:00:00Z'),
  daynum: 2460310.0,
  solar_lat: -23.1,
  solar_lon: 123.4,
  units: 'kilometers' as const,
};

/**
 * Mock country data
 */
export const mockCountries = [
  {
    name: 'United Kingdom',
    capital: 'London',
    latlng: [51.5074, -0.1278] as [number, number],
  },
  {
    name: 'United States',
    capital: 'Washington, D.C.',
    latlng: [38.9072, -77.0369] as [number, number],
  },
];