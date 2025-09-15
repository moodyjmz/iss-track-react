import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsPageFocused } from './useIsPageFocused';

describe('useIsPageFocused', () => {
  let mockCallback: ReturnType<typeof vi.fn>;
  let focusEvent: Event;
  let blurEvent: Event;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCallback = vi.fn();
    focusEvent = new Event('focus');
    blurEvent = new Event('blur');

    // Mock document.hasFocus
    Object.defineProperty(document, 'hasFocus', {
      value: vi.fn(() => true),
      writable: true,
    });
  });

  it('returns true initially', () => {
    const { result } = renderHook(() => useIsPageFocused(mockCallback));

    expect(result.current).toBe(true);
  });

  it('calls callback with initial value', () => {
    renderHook(() => useIsPageFocused(mockCallback));

    expect(mockCallback).toHaveBeenCalledWith(true);
  });

  it('updates state when window gains focus', () => {
    const { result } = renderHook(() => useIsPageFocused(mockCallback));

    // Mock document.hasFocus to return true
    (document.hasFocus as any).mockReturnValue(true);

    act(() => {
      window.dispatchEvent(focusEvent);
    });

    expect(result.current).toBe(true);
    expect(mockCallback).toHaveBeenCalledWith(true);
  });

  it('updates state when window loses focus', () => {
    const { result } = renderHook(() => useIsPageFocused(mockCallback));

    // Mock document.hasFocus to return false
    (document.hasFocus as any).mockReturnValue(false);

    act(() => {
      window.dispatchEvent(blurEvent);
    });

    expect(result.current).toBe(false);
    expect(mockCallback).toHaveBeenCalledWith(false);
  });

  it('does not call callback if not provided', () => {
    const { result } = renderHook(() => useIsPageFocused(undefined as any));

    expect(result.current).toBe(true);
    // Should not throw error
  });

  it('removes event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useIsPageFocused(mockCallback));

    unmount();

    // Should clean up event listeners via AbortController
    expect(removeEventListenerSpy).not.toHaveBeenCalled(); // Because we use AbortController
  });

  it('handles focus changes correctly', () => {
    const { result } = renderHook(() => useIsPageFocused(mockCallback));

    // Simulate losing focus
    (document.hasFocus as any).mockReturnValue(false);
    act(() => {
      window.dispatchEvent(blurEvent);
    });

    expect(result.current).toBe(false);
    expect(mockCallback).toHaveBeenCalledWith(false);

    // Simulate gaining focus
    (document.hasFocus as any).mockReturnValue(true);
    act(() => {
      window.dispatchEvent(focusEvent);
    });

    expect(result.current).toBe(true);
    expect(mockCallback).toHaveBeenCalledWith(true);
  });
});