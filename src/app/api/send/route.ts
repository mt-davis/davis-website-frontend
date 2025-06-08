import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Base email schema
const baseEmailSchema = {
  name: z.string().min(2).max(50),
  email: z.string().email(),
  hcaptchaToken: z.string(),
};

// Regular contact form schema
const contactEmailSchema = z.object({
  ...baseEmailSchema,
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000),
});

// RFP form schema
const rfpEmailSchema = z.object({
  ...baseEmailSchema,
  company: z.string().max(100).optional(),
  experience: z.string().max(2000).optional(),
  approach: z.string().max(2000).optional(),
  references: z.string().max(1000).optional(),
});

// Combined schema that accepts either format
const emailSchema = z.union([contactEmailSchema, rfpEmailSchema]);

// Type inference
type ContactFormData = z.infer<typeof contactEmailSchema>;
type RFPFormData = z.infer<typeof rfpEmailSchema>;
type FormData = z.infer<typeof emailSchema>;

// Type guards
function isRFPForm(data: FormData): data is RFPFormData {
  return !('subject' in data) && !('message' in data);
}

function isContactForm(data: FormData): data is ContactFormData {
  return 'subject' in data && 'message' in data;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

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

    const formData = result.data;
    const { name, email, hcaptchaToken } = formData;

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

    // Prepare email content based on submission type
    const emailContent = isRFPForm(formData)
      ? `Executive Coach RFP Submission

Name: ${name}
Email: ${email}
${formData.company ? `Company/Organization: ${formData.company}\n` : ''}
${formData.experience ? `\nCoaching Experience:\n${formData.experience}` : ''}
${formData.approach ? `\nCoaching Approach:\n${formData.approach}` : ''}
${formData.references ? `\nReferences:\n${formData.references}` : ''}`
      : `Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${formData.subject}

Message:
${formData.message}`;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: isRFPForm(formData)
        ? `Executive Coach RFP: ${name}${formData.company ? ` from ${formData.company}` : ''}`
        : `Contact Form: ${formData.subject}`,
      text: emailContent,
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