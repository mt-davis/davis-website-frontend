import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Resend is initialized lazily inside the handler to avoid build-time failures
// when RESEND_API_KEY is not present in the build environment.

// Very simple in-memory rate limiter per-IP to protect the contact endpoint.
// Note: For serverless/edge, prefer a durable store (e.g., Upstash Ratelimit).
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;            // 5 requests per window

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function isRateLimited(ip: string, now = Date.now()): boolean {
  const entries = requestLog.get(ip) || [];
  const recent = entries.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

// Email validation schema
const emailSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000),
  hcaptchaToken: z.string(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    console.log('Received request body:', body);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    const resend = new Resend(apiKey);

    // Validate request body
    const result = emailSchema.safeParse(body);
    if (!result.success) {
      console.error('Validation errors:', result.error.errors);
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: result.error.errors
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, hcaptchaToken } = result.data;

    // Skip hCaptcha verification if using test key in development
    const isTestKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY === '10000000-ffff-ffff-ffff-000000000001';
    
    if (!isTestKey) {
      // Verify hCaptcha token in production
      const verificationUrl = 'https://api.hcaptcha.com/siteverify';
      const verificationResponse = await fetch(verificationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.HCAPTCHA_SECRET_KEY!,
          response: hcaptchaToken,
        }),
      });

      const verificationData = await verificationResponse.json();
      if (!verificationData.success) {
        console.error('hCaptcha verification failed:', verificationData);
        return NextResponse.json(
          { error: 'Invalid captcha', details: verificationData },
          { status: 400 }
        );
      }
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 