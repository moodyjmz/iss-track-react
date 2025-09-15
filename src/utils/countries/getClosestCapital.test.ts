import { describe, it, expect, vi } from 'vitest';
import { getClosestCapital } from './getClosestCapital';
import type { Country } from '../../types/country';
import type { Coordinates } from '../../types/coordinates';

// Mock the getClosestCountry function
vi.mock('./getClosestCountry', () => ({
  getClosestCountry: vi.fn(),
}));

describe('getClosestCapital', () => {
  const mockCountries: Country[] = [
    {
      name: 'United Kingdom',
      capital: 'London',
      latlng: [51.5074, -0.1278],
    },
    {
      name: 'France',
      capital: 'Paris',
      latlng: [48.8566, 2.3522],
    },
  ];

  it('returns closest capital when position and countries are provided', async () => {
    const { getClosestCountry } = await import('./getClosestCountry');
    (getClosestCountry as any).mockReturnValue(mockCountries[0]);

    const position: Coordinates = {
      latitude: 51.5,
      longitude: -0.1,
    };

    const result = getClosestCapital({ position, countries: mockCountries });

    expect(result).toBe('London');
    expect(getClosestCountry).toHaveBeenCalledWith(mockCountries, 51.5, -0.1);
  });

  it('returns undefined when position is null', () => {
    const result = getClosestCapital({ position: null, countries: mockCountries });
    expect(result).toBeUndefined();
  });

  it('returns undefined when countries is null', () => {
    const position: Coordinates = { latitude: 51.5, longitude: -0.1 };
    const result = getClosestCapital({ position, countries: null });
    expect(result).toBeUndefined();
  });

  it('returns undefined when getClosestCountry returns null', async () => {
    const { getClosestCountry } = await import('./getClosestCountry');
    (getClosestCountry as any).mockReturnValue(null);

    const position: Coordinates = { latitude: 0, longitude: 0 };
    const result = getClosestCapital({ position, countries: mockCountries });

    expect(result).toBeUndefined();
  });
});