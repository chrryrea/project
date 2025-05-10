import { POST } from '../route';
import { headers } from 'next/headers';

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

describe('Contact API Route', () => {
  beforeEach(() => {
    // Reset rate limit store before each test
    (global as any).rateLimitStore = new Map();
  });

  it('returns 400 for invalid input', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });

    // Mock headers to return a consistent IP
    (headers as jest.Mock).mockReturnValue({
      get: () => '127.0.0.1',
    });

    // Make multiple requests to exceed rate limit
    for (let i = 0; i < 6; i++) {
      await POST(request);
    }

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe('Too many requests. Please try again later.');
  });

  it('returns 200 for valid input', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Message sent successfully!');
  });
}); 