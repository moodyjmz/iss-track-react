import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchCountries } from './CountriesService';
import { mockFetch, createMockResponse, mockCountries } from '../test/utils';

// Mock the dependencies
vi.mock('../utils/countries/sortCities', () => ({
  sortCities: vi.fn((data) => data),
}));

vi.mock('./BaseService', () => ({
  fetchWithRetries: vi.fn(),
}));

describe('CountriesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchWithRetries with correct parameters', async () => {
    const { fetchWithRetries } = await import('./BaseService');
    (fetchWithRetries as any).mockResolvedValue(mockCountries);

    const args = { signal: new AbortController().signal };
    await fetchCountries(args);

    expect(fetchWithRetries).toHaveBeenCalledWith(
      {
        url: expect.stringContaining('countries.json'),
        callback: expect.any(Function),
        transport: { signal: args.signal },
      },
      3
    );
  });

  it('handles transport options correctly', async () => {
    const { fetchWithRetries } = await import('./BaseService');
    (fetchWithRetries as any).mockResolvedValue(mockCountries);

    const customTransport = { timeout: 5000 };
    const args = {
      args: { transport: customTransport },
      signal: new AbortController().signal,
    };

    await fetchCountries(args);

    expect(fetchWithRetries).toHaveBeenCalledWith(
      {
        url: expect.stringContaining('countries.json'),
        callback: expect.any(Function),
        transport: { ...customTransport, signal: args.signal },
      },
      3
    );
  });

  it('handles missing args gracefully', async () => {
    const { fetchWithRetries } = await import('./BaseService');
    (fetchWithRetries as any).mockResolvedValue(mockCountries);

    await fetchCountries();

    expect(fetchWithRetries).toHaveBeenCalledWith(
      {
        url: expect.stringContaining('countries.json'),
        callback: expect.any(Function),
        transport: {},
      },
      3
    );
  });

  it('returns Country[] type', async () => {
    const { fetchWithRetries } = await import('./BaseService');
    (fetchWithRetries as any).mockResolvedValue(mockCountries);

    const result = await fetchCountries();

    expect(result).toEqual(mockCountries);
    expect(Array.isArray(result)).toBe(true);

    if (result.length > 0) {
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('capital');
      expect(result[0]).toHaveProperty('latlng');
    }
  });
});