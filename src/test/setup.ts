import '@testing-library/jest-dom';

// Mock window.customElements for the scrambler element
Object.defineProperty(window, 'customElements', {
  value: {
    define: vi.fn(),
    get: vi.fn(),
    whenDefined: vi.fn(() => Promise.resolve()),
  },
  writable: true,
});

// Mock AbortController for older browsers
if (!global.AbortController) {
  global.AbortController = class AbortController {
    signal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    abort = vi.fn();
  };
}

// Mock fetch globally
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
vi.stubGlobal('console', {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});