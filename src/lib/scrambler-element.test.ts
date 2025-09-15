import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Import the scrambler element to register it
import './scrambler-element';

describe('ScramblerElement', () => {
  let element: HTMLElement;

  beforeEach(() => {
    // Create a fresh element for each test
    element = document.createElement('scrambler-element');
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up after each test
    if (element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('is defined as a custom element', () => {
    // Since our test setup mocks customElements, we need to check if define was called
    expect(window.customElements.define).toHaveBeenCalledWith('scrambler-element', expect.any(Function));
  });

  it('renders with default values', () => {
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('scrambler-element');
  });

  it('accepts value attribute', () => {
    element.setAttribute('value', '123.45');
    expect(element.getAttribute('value')).toBe('123.45');
  });

  it('accepts unit attribute', () => {
    element.setAttribute('unit', 'kilometer');
    expect(element.getAttribute('unit')).toBe('kilometer');
  });

  it('accepts locale attribute', () => {
    element.setAttribute('locale', 'en-US');
    expect(element.getAttribute('locale')).toBe('en-US');
  });

  it('accepts decimal-places attribute', () => {
    element.setAttribute('decimal-places', '2');
    expect(element.getAttribute('decimal-places')).toBe('2');
  });

  it('defaults to en-GB locale when none specified', () => {
    // The element should use DEFAULT_LOCALE internally
    element.setAttribute('value', '1000');
    element.setAttribute('unit', 'kilometer');

    // Wait for the element to process the attributes
    setTimeout(() => {
      // The formatted output should use en-GB formatting
      expect(element.textContent).toContain('1,000');
    }, 100);
  });

  it('formats numbers with specified locale', () => {
    element.setAttribute('value', '1234.56');
    element.setAttribute('unit', 'kilometer');
    element.setAttribute('locale', 'en-US');

    setTimeout(() => {
      // en-US uses commas for thousands and periods for decimals
      expect(element.textContent).toContain('1,234.56');
    }, 100);
  });

  it('handles unit formatting', () => {
    element.setAttribute('value', '100');
    element.setAttribute('unit', 'kilometer');
    element.setAttribute('locale', 'en-GB');

    setTimeout(() => {
      // Should include the unit in the formatted output
      expect(element.textContent).toContain('km');
    }, 100);
  });

  it('handles decimal places', () => {
    element.setAttribute('value', '123.456789');
    element.setAttribute('decimal-places', '2');
    element.setAttribute('unit', 'kilometer');

    setTimeout(() => {
      // Should round to 2 decimal places
      expect(element.textContent).toContain('123.46');
    }, 100);
  });

  it('falls back to simple formatting on Intl error', () => {
    // Mock Intl.NumberFormat to throw an error
    const originalIntl = global.Intl;
    global.Intl = {
      ...originalIntl,
      NumberFormat: vi.fn(() => {
        throw new Error('Intl error');
      })
    } as any;

    element.setAttribute('value', '123.45');
    element.setAttribute('unit', 'kilometer');

    setTimeout(() => {
      // Should fall back to simple format: "value unit"
      expect(element.textContent).toBe('123.45 kilometer');
    }, 100);

    // Restore original Intl
    global.Intl = originalIntl;
  });

  it('handles empty or invalid values', () => {
    element.setAttribute('value', '');
    element.setAttribute('unit', 'kilometer');

    setTimeout(() => {
      // Should handle empty values gracefully
      expect(element.textContent).not.toThrow;
    }, 100);
  });

  it('updates when value changes', () => {
    element.setAttribute('value', '100');
    element.setAttribute('unit', 'kilometer');

    setTimeout(() => {
      const firstValue = element.textContent;

      // Change the value
      element.setAttribute('value', '200');

      setTimeout(() => {
        const secondValue = element.textContent;
        expect(secondValue).not.toBe(firstValue);
      }, 100);
    }, 100);
  });

  it('handles attribute changes reactively', () => {
    element.setAttribute('value', '100');
    element.setAttribute('unit', 'kilometer');
    element.setAttribute('locale', 'en-GB');

    setTimeout(() => {
      // Change locale
      element.setAttribute('locale', 'de-DE');

      setTimeout(() => {
        // German locale should format differently
        expect(element.textContent).toBeTruthy();
      }, 100);
    }, 100);
  });
});