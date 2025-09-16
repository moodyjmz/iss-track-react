import type { OrbitalPosition } from '@stores/orbitalStore';

export interface TLEData {
  satellite_id: number;
  name: string;
  date: string;
  line1: string;
  line2: string;
}

export interface PositionsRequest {
  timestamps: number[];
  units?: 'kilometers' | 'miles';
}

export interface PositionsResponse {
  id: number;
  name: string;
  positions: Array<{
    satlatitude: number;
    satlongitude: number;
    sataltitude: number;
    azimuth: number;
    elevation: number;
    ra: number;
    dec: number;
    timestamp: number;
    eclipsed: boolean;
  }>;
}

/**
 * Service for fetching ISS historical and predicted orbital data
 */
export class OrbitalDataService {
  private static readonly ISS_ID = 25544;
  private static readonly BASE_URL = 'https://api.wheretheiss.at/v1';
  private static readonly MAX_TIMESTAMPS_PER_REQUEST = 10;

  constructor() {
    // Constructor for orbital data service
  }

  /**
   * Custom fetch with retries that maintains error propagation
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = 2
  ): Promise<Response> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (response.ok) {
          return response;
        }

        // If this is the last attempt, throw the error
        if (attempt === retries) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));

      } catch (error) {
        // If this is the last attempt or an abort error, throw immediately
        if (attempt === retries || (error as Error).name === 'AbortError') {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Generate timestamps for historical data retrieval
   */
  private generateHistoricalTimestamps(hours: number): number[] {
    const now = Math.floor(Date.now() / 1000);
    const hoursInSeconds = hours * 3600;
    const interval = 300; // 5 minutes intervals
    const timestamps: number[] = [];

    for (let i = hoursInSeconds; i >= 0; i -= interval) {
      timestamps.push(now - i);
    }

    return timestamps;
  }

  /**
   * Generate timestamps for future predictions
   */
  private generateFutureTimestamps(hours: number): number[] {
    const now = Math.floor(Date.now() / 1000);
    const hoursInSeconds = hours * 3600;
    const interval = 300; // 5 minutes intervals
    const timestamps: number[] = [];

    for (let i = interval; i <= hoursInSeconds; i += interval) {
      timestamps.push(now + i);
    }

    return timestamps;
  }

  /**
   * Fetch ISS positions for specific timestamps
   */
  private async fetchPositions(
    timestamps: number[],
    units: 'kilometers' | 'miles' = 'kilometers',
    signal?: AbortSignal
  ): Promise<PositionsResponse> {
    const timestampParams = timestamps.join(',');
    const url = `${OrbitalDataService.BASE_URL}/satellites/${OrbitalDataService.ISS_ID}/positions?timestamps=${timestampParams}&units=${units}`;

    const response = await this.fetchWithRetry(url, {
      method: 'GET',
      signal,
    });

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from orbital data API');
    }

    return data;
  }

  /**
   * Convert API response to OrbitalPosition format
   */
  private convertToOrbitalPositions(response: PositionsResponse): OrbitalPosition[] {
    // Handle case where response or positions is undefined/null
    if (!response || !response.positions || !Array.isArray(response.positions)) {
      console.warn('Invalid or empty positions response:', response);
      return [];
    }

    return response.positions.map(pos => ({
      latitude: pos.satlatitude,
      longitude: pos.satlongitude,
      altitude: pos.sataltitude,
      timestamp: pos.timestamp * 1000, // Convert to milliseconds
      velocity: undefined, // Not provided by this endpoint
    }));
  }

  /**
   * Fetch historical orbital positions
   */
  async getHistoricalPositions(
    hours: number = 2,
    units: 'kilometers' | 'miles' = 'kilometers',
    signal?: AbortSignal
  ): Promise<OrbitalPosition[]> {
    const timestamps = this.generateHistoricalTimestamps(hours);
    const allPositions: OrbitalPosition[] = [];

    // Split timestamps into chunks to respect API limits
    const chunks = [];
    for (let i = 0; i < timestamps.length; i += OrbitalDataService.MAX_TIMESTAMPS_PER_REQUEST) {
      chunks.push(timestamps.slice(i, i + OrbitalDataService.MAX_TIMESTAMPS_PER_REQUEST));
    }

    // Fetch positions for each chunk
    for (const chunk of chunks) {
      if (signal?.aborted) {
        throw new DOMException('The operation was aborted.', 'AbortError');
      }

      try {
        const response = await this.fetchPositions(chunk, units, signal);
        const positions = this.convertToOrbitalPositions(response);
        allPositions.push(...positions);

        // Add small delay to respect rate limits (1 request per second)
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1100));
        }
      } catch (error) {
        if (signal?.aborted || (error as Error).name === 'AbortError') {
          throw error;
        }
        throw error;
      }
    }

    return allPositions.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Fetch future orbital predictions
   */
  async getFuturePositions(
    hours: number = 1,
    units: 'kilometers' | 'miles' = 'kilometers',
    signal?: AbortSignal
  ): Promise<OrbitalPosition[]> {
    const timestamps = this.generateFutureTimestamps(hours);
    const allPositions: OrbitalPosition[] = [];

    // Split timestamps into chunks to respect API limits
    const chunks = [];
    for (let i = 0; i < timestamps.length; i += OrbitalDataService.MAX_TIMESTAMPS_PER_REQUEST) {
      chunks.push(timestamps.slice(i, i + OrbitalDataService.MAX_TIMESTAMPS_PER_REQUEST));
    }

    // Fetch positions for each chunk
    for (const chunk of chunks) {
      if (signal?.aborted) break;

      try {
        const response = await this.fetchPositions(chunk, units, signal);
        const positions = this.convertToOrbitalPositions(response);
        allPositions.push(...positions);

        // Add small delay to respect rate limits
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1100));
        }
      } catch (error) {
        if (signal?.aborted) break;
        throw error;
      }
    }

    return allPositions.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Fetch TLE (Two-Line Element) data for orbital calculations
   */
  async getTLEData(signal?: AbortSignal): Promise<TLEData> {
    const url = `${OrbitalDataService.BASE_URL}/satellites/${OrbitalDataService.ISS_ID}/tles?format=json`;

    const response = await this.fetchWithRetry(url, {
      method: 'GET',
      signal,
    });

    return response.json();
  }

  /**
   * Calculate orbital period from current position data
   * ISS orbital period is approximately 90-93 minutes
   */
  calculateOrbitalPeriod(): number {
    return 92.68; // minutes - ISS average orbital period
  }

  /**
   * Estimate ground track based on orbital mechanics
   */
  estimateGroundTrack(position: OrbitalPosition): OrbitalPosition[] {
    const period = this.calculateOrbitalPeriod() * 60 * 1000; // Convert to milliseconds
    const groundTrack: OrbitalPosition[] = [];

    // Simple approximation - ISS moves roughly 360 degrees longitude per orbit
    const degreesPerMs = 360 / period;
    const steps = 100; // Number of points in ground track
    const stepTime = period / steps;

    for (let i = 0; i < steps; i++) {
      const timeOffset = i * stepTime;
      const longitudeOffset = i * degreesPerMs * stepTime;

      groundTrack.push({
        latitude: position.latitude, // Simplified - actual latitude changes
        longitude: ((position.longitude + longitudeOffset) + 180) % 360 - 180, // Wrap longitude
        altitude: position.altitude,
        timestamp: position.timestamp + timeOffset,
      });
    }

    return groundTrack;
  }
}