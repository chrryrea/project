import { render, screen, fireEvent, act } from '../../test-utils';
import ErrorBoundary from '../ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(container).toHaveTextContent('Test content');
  });

  it('renders error UI when there is an error', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(container).toHaveTextContent('Something went wrong');
    expect(container).toHaveTextContent('3 attempts remaining');
  });

  it('tracks retry attempts and shows remaining count', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // First attempt
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    expect(container).toHaveTextContent('2 attempts remaining');

    // Second attempt
    fireEvent.click(retryButton);
    expect(container).toHaveTextContent('1 attempts remaining');

    // Final attempt
    fireEvent.click(retryButton);
    expect(container).toHaveTextContent('Maximum retry attempts reached');
  });

  it('auto-resets after timeout when max retries reached', () => {
    const { container } = render(
      <ErrorBoundary resetTimeout={1000}>
        <ThrowError />
      </ErrorBoundary>
    );

    // Exhaust all retries
    const retryButton = screen.getByRole('button', { name: /retry/i });
    for (let i = 0; i < 3; i++) {
      fireEvent.click(retryButton);
    }

    expect(container).toHaveTextContent('Maximum retry attempts reached');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should show retry button again
    expect(container).toHaveTextContent('3 attempts remaining');
  });

  it('accepts custom maxRetries prop', () => {
    const { container } = render(
      <ErrorBoundary maxRetries={2}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(container).toHaveTextContent('2 attempts remaining');
  });

  it('cleans up timeout on unmount', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    for (let i = 0; i < 3; i++) {
      fireEvent.click(retryButton);
    }

    unmount();
    // Ensure no memory leaks or errors after unmount
    expect(jest.getTimerCount()).toBe(0);
  });
}); 