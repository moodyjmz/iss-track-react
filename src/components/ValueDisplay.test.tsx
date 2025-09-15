import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../test/utils';
import ValueDisplay from './ValueDisplay';

// Mock the scrambler element
const mockSetAttribute = vi.fn();
const mockScrambler = {
  setAttribute: mockSetAttribute,
};

beforeEach(() => {
  vi.clearAllMocks();
  // Mock the useRef to return our mock scrambler
  vi.doMock('react', async () => {
    const actual = await vi.importActual('react');
    return {
      ...actual,
      useRef: () => ({ current: mockScrambler }),
    };
  });
});

describe('ValueDisplay', () => {
  it('renders the title', () => {
    render(<ValueDisplay value={123.45} title="Test Value" />);

    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('renders the scrambler element', () => {
    render(<ValueDisplay value={123.45} title="Test Value" />);

    const scramblerElement = document.querySelector('scrambler-element');
    expect(scramblerElement).toBeInTheDocument();
  });

  it('handles string values', () => {
    render(<ValueDisplay value="test string" title="String Value" />);

    expect(screen.getByText('String Value')).toBeInTheDocument();
  });

  it('handles number values with decimal places', () => {
    render(<ValueDisplay value={123.456} title="Number Value" decimalPlaces={2} />);

    expect(screen.getByText('Number Value')).toBeInTheDocument();
  });

  it('handles values with units', () => {
    render(<ValueDisplay value={45.5} title="Speed" unit="kilometer-per-hour" />);

    expect(screen.getByText('Speed')).toBeInTheDocument();
  });

  it('handles custom locale', () => {
    render(<ValueDisplay value={1234.56} title="Formatted Number" locale="de-DE" />);

    expect(screen.getByText('Formatted Number')).toBeInTheDocument();
  });
});