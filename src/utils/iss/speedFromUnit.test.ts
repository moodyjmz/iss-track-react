import { describe, it, expect } from 'vitest';
import speedFromUnit from './speedFromUnit';

describe('speedFromUnit', () => {
  it('returns "kph" for kilometers unit', () => {
    const result = speedFromUnit('kilometers');
    expect(result).toBe('kph');
  });

  it('returns "mph" for miles unit', () => {
    const result = speedFromUnit('miles');
    expect(result).toBe('mph');
  });

  it('returns first character + "ph" for any unit', () => {
    const result = speedFromUnit('test');
    expect(result).toBe('tph');
  });

  it('handles empty string', () => {
    const result = speedFromUnit('');
    expect(result).toBe('unknown');
  });

  it('handles null input', () => {
    const result = speedFromUnit(null as any);
    expect(result).toBe('unknown');
  });

  it('handles undefined input', () => {
    const result = speedFromUnit(undefined as any);
    expect(result).toBe('unknown');
  });

  it('handles single character units', () => {
    const result = speedFromUnit('m');
    expect(result).toBe('mph');
  });

  it('handles long unit names', () => {
    const result = speedFromUnit('nautical-miles');
    expect(result).toBe('nph');
  });
});