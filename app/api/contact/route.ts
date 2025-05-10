import { NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';

// Rate limiting configuration
const RATE_LIMIT = 5; // requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// In-memory store for rate limiting (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const rateLimit = rateLimitStore.get(ip);
    
    if (rateLimit) {
      if (now > rateLimit.resetTime) {
        // Reset if window has passed
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else if (rateLimit.count >= RATE_LIMIT) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      } else {
        // Increment count
        rateLimitStore.set(ip, {
          count: rateLimit.count + 1,
          resetTime: rateLimit.resetTime,
        });
      }
    } else {
      // First request from this IP
      rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Here you would typically:
    // 1. Send an email
    // 2. Store in database
    // 3. Integrate with CRM
    // For now, we'll just simulate a successful response
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 