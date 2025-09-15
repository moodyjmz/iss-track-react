import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import Loader from './Loader';

describe('Loader', () => {
  it('renders the loader element', () => {
    render(<Loader />);

    const loader = document.querySelector('.loader');
    expect(loader).toBeInTheDocument();
  });

  it('has the correct CSS class', () => {
    render(<Loader />);

    const loader = document.querySelector('.loader');
    expect(loader).toHaveClass('loader');
  });

  it('renders as a span element', () => {
    render(<Loader />);

    const loader = document.querySelector('span.loader');
    expect(loader).toBeInTheDocument();
  });
});