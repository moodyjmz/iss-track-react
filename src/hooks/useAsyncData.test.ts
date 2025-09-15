import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsyncData } from './useAsyncData';
import { createDelayedPromise } from '../test/utils';

describe('useAsyncData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a promise initially', () => {
    const mockFn = vi.fn(() => Promise.resolve('test data'));
    const { result } = renderHook(() => useAsyncData(mockFn));

    expect(result.current).toBeInstanceOf(Promise);
  });

  it('calls the promise function with args and signal', () => {
    const mockFn = vi.fn(() => Promise.resolve('test data'));
    const args = { test: 'value' };

    renderHook(() => useAsyncData(mockFn, args));

    expect(mockFn).toHaveBeenCalledWith({
      args,
      signal: expect.any(AbortSignal),
    });
  });

  it('returns a promise that resolves with data', async () => {
    const testData = { id: 1, name: 'test' };
    const mockFn = vi.fn(() => Promise.resolve(testData));

    const { result } = renderHook(() => useAsyncData(mockFn));

    await waitFor(() => {
      expect(result.current).toBeInstanceOf(Promise);
    });

    const resolvedData = await result.current!;
    expect(resolvedData).toEqual(testData);
  });

  it('handles promise rejection', async () => {
    const mockError = new Error('Test error');
    const mockFn = vi.fn(() => Promise.reject(mockError));

    const { result } = renderHook(() => useAsyncData(mockFn));

    await waitFor(() => {
      expect(result.current).toBeInstanceOf(Promise);
    });

    await expect(result.current).rejects.toThrow('Test error');
  });

  it('aborts previous request when args change', () => {
    const mockFn = vi.fn(() => createDelayedPromise('data', 100));
    let args = { page: 1 };

    const { rerender } = renderHook(() => useAsyncData(mockFn, args));

    expect(mockFn).toHaveBeenCalledTimes(1);

    // Change args to trigger new request
    args = { page: 2 };
    rerender();

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('aborts request on unmount', () => {
    const mockFn = vi.fn(() => createDelayedPromise('data', 100));
    const abortSpy = vi.fn();

    // Mock AbortController
    const mockAbortController = {
      signal: { addEventListener: vi.fn(), removeEventListener: vi.fn() },
      abort: abortSpy,
    };

    vi.stubGlobal('AbortController', vi.fn(() => mockAbortController));

    const { unmount } = renderHook(() => useAsyncData(mockFn));

    unmount();

    expect(abortSpy).toHaveBeenCalled();
  });

  it('handles typed data correctly', async () => {
    interface TestData {
      id: number;
      name: string;
    }

    const testData: TestData = { id: 1, name: 'test' };
    const mockFn = vi.fn(() => Promise.resolve(testData));

    const { result } = renderHook(() => useAsyncData<TestData>(mockFn));

    await waitFor(() => {
      expect(result.current).toBeInstanceOf(Promise);
    });

    const resolvedData = await result.current!;
    expect(resolvedData).toEqual(testData);
    expect(resolvedData.id).toBe(1);
    expect(resolvedData.name).toBe('test');
  });
});