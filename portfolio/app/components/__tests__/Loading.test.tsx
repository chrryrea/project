import { render, screen } from '../../test-utils';
import Loading from '../Loading';

describe('Loading', () => {
  it('renders with default props', () => {
    render(<Loading />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('w-8 h-8'); // Default size (md)
  });

  it('renders with small size', () => {
    render(<Loading size="sm" />);
    const loader = screen.getByRole('status');
    expect(loader).toHaveClass('w-4 h-4');
  });

  it('renders with large size', () => {
    render(<Loading size="lg" />);
    const loader = screen.getByRole('status');
    expect(loader).toHaveClass('w-12 h-12');
  });

  it('renders in fullscreen mode', () => {
    render(<Loading fullScreen />);
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('fixed inset-0');
  });

  it('renders in non-fullscreen mode', () => {
    render(<Loading />);
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('p-4');
  });
}); 