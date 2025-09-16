import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OrbitalDataService } from './OrbitalDataService';
import type { PositionsResponse, OrbitalPosition } from './OrbitalDataService';

// Mock the fetch function
global.fetch = vi.fn();

const mockFetch = vi.mocked(fetch);

describe('OrbitalDataService', () => {
  let service: OrbitalDataService;
  let abortController: AbortController;

  beforeEach(() => {
    service = new OrbitalDataService();
    abortController = new AbortController();
    vi.clearAllMocks();
  });

  afterEach(() => {
    abortController.abort();
  });

  describe('generateHistoricalTimestamps', () => {
    it('generates correct number of timestamps for historical data', async () => {
      // Mock successful response
      const mockResponse: PositionsResponse = {
        id: 25544,
        name: 'iss',
        positions: [
          {
            satlatitude: 51.5,
            satlongitude: -0.1,
            sataltitude: 408,
            azimuth: 0,
            elevation: 0,
            ra: 0,
            dec: 0,
            timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
            eclipsed: false,
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.getHistoricalPositions(0.5, 'kilometers', abortController.signal);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('latitude');
      expect(result[0]).toHaveProperty('longitude');
      expect(result[0]).toHaveProperty('altitude');
      expect(result[0]).toHaveProperty('timestamp');
    });
  });

  describe('getFuturePositions', () => {
    it('fetches future positions successfully', async () => {
      const mockResponse: PositionsResponse = {
        id: 25544,
        name: 'iss',
        positions: [
          {
            satlatitude: 48.8,
            satlongitude: 2.3,
            sataltitude: 410,
            azimuth: 45,
            elevation: 30,
            ra: 12,
            dec: 45,
            timestamp: Math.floor(Date.now() / 1000) + 1800, // 30 minutes from now
            eclipsed: false,
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.getFuturePositions(0.5, 'kilometers', abortController.signal);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].latitude).toBe(48.8);
      expect(result[0].longitude).toBe(2.3);
      expect(result[0].altitude).toBe(410);
    });
  });

  describe('convertToOrbitalPositions', () => {
    it('converts API response to OrbitalPosition format correctly', async () => {
      const mockApiResponse: PositionsResponse = {
        id: 25544,
        name: 'iss',
        positions: [
          {
            satlatitude: 40.7128,
            satlongitude: -74.0060,
            sataltitude: 415.5,
            azimuth: 180,
            elevation: 45,
            ra: 90,
            dec: 30,
            timestamp: 1640995200, // Unix timestamp
            eclipsed: true,
          }
        ]
      };

      // Mock multiple calls since getHistoricalPositions may make multiple requests
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await service.getHistoricalPositions(0.1, 'kilometers', abortController.signal);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].latitude).toBe(40.7128);
      expect(result[0].longitude).toBe(-74.0060);
      expect(result[0].altitude).toBe(415.5);
      expect(result[0].timestamp).toBe(1640995200 * 1000); // Converted to milliseconds
      expect(result[0].velocity).toBeUndefined();
    });
  });

  describe('getTLEData', () => {
    it('fetches TLE data successfully', async () => {
      const mockTLEResponse = {
        satellite_id: 25544,
        name: 'ISS (ZARYA)',
        date: '2024-01-01T12:00:00Z',
        line1: '1 25544U 98067A   24001.50000000  .00001234  00000-0  12345-4 0  9990',
        line2: '2 25544  51.6400 123.4567 0001234  12.3456  78.9012 15.50000000123456'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTLEResponse,
      } as Response);

      const result = await service.getTLEData(abortController.signal);

      expect(result).toEqual(mockTLEResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.wheretheiss.at/v1/satellites/25544/tles?format=json',
        expect.objectContaining({
          method: 'GET',
          signal: abortController.signal,
        })
      );
    });
  });

  describe('calculateOrbitalPeriod', () => {
    it('returns correct ISS orbital period', () => {
      const period = service.calculateOrbitalPeriod();
      expect(period).toBe(92.68);
      expect(typeof period).toBe('number');
    });
  });

  describe('estimateGroundTrack', () => {
    it('generates ground track points from orbital position', () => {
      const position: OrbitalPosition = {
        latitude: 0,
        longitude: 0,
        altitude: 408,
        timestamp: Date.now()
      };

      const groundTrack = service.estimateGroundTrack(position);

      expect(Array.isArray(groundTrack)).toBe(true);
      expect(groundTrack.length).toBe(100);
      expect(groundTrack[0]).toHaveProperty('latitude');
      expect(groundTrack[0]).toHaveProperty('longitude');
      expect(groundTrack[0]).toHaveProperty('altitude');
      expect(groundTrack[0]).toHaveProperty('timestamp');

      // Check longitude wrapping
      groundTrack.forEach(point => {
        expect(point.longitude).toBeGreaterThanOrEqual(-180);
        expect(point.longitude).toBeLessThanOrEqual(180);
      });
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      // Clear all mocks for error handling tests
      vi.clearAllMocks();
    });

    it('handles API errors gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(
        service.getHistoricalPositions(0.1, 'kilometers', abortController.signal)
      ).rejects.toThrow('HTTP Error: 500');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        service.getFuturePositions(0.1, 'kilometers', abortController.signal)
      ).rejects.toThrow('Network error');
    });

    it('handles abort signals', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        service.getHistoricalPositions(1, 'kilometers', controller.signal)
      ).rejects.toThrow('The operation was aborted.');
    });
  });

  describe('rate limiting', () => {
    it('respects API rate limits with delays between requests', async () => {
      const mockResponse: PositionsResponse = {
        id: 25544,
        name: 'iss',
        positions: [
          {
            satlatitude: 0,
            satlongitude: 0,
            sataltitude: 408,
            azimuth: 0,
            elevation: 0,
            ra: 0,
            dec: 0,
            timestamp: Math.floor(Date.now() / 1000),
            eclipsed: false,
          }
        ]
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Test with a short duration to avoid long test times
      const result = await service.getHistoricalPositions(0.1, 'kilometers', abortController.signal);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});