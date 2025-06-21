import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Base schema for common fields
const baseSchema = {
  name: z.string().min(2).max(50),
  email: z.string().email(),
  turnstileToken: z.string(),
};

// Contact form schema
const contactEmailSchema = z.object({
  ...baseSchema,
  subject: z.string().min(3).max(100),
  message: z.string().min(10).max(1000),
});

// RFP form schema
const rfpEmailSchema = z.object({
  ...baseSchema,
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
  return (
    'company' in data ||
    'experience' in data ||
    'approach' in data ||
    'references' in data
  );
}

export async function POST(request: Request) {
  try {
    let body: Record<string, any>;
    let files: File[] = [];

    // Check content type and parse accordingly
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      files = formData.getAll('attachments') as File[];
      body = {};
      formData.forEach((value, key) => {
        if (key !== 'attachments') {
          body[key] = value;
        }
      });
    } else {
      body = await request.json();
    }

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

    const validatedData = result.data;
    const { name, email, turnstileToken } = validatedData;

    // Skip Turnstile verification if using test key in development
    const isTestKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === '1x00000000000000000000AA';

    if (!isTestKey) {
      // Verify Turnstile token in production
      const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const verificationResponse = await fetch(verificationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY!,
          response: turnstileToken,
        }),
      });

      const verificationData = await verificationResponse.json();
      if (!verificationData.success) {
        console.error('Turnstile verification failed:', verificationData);
        return NextResponse.json(
          { error: 'Invalid captcha', details: verificationData },
          { status: 400 }
        );
      }
    }

    // Process file attachments if present
    const attachments = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        return {
          filename: file.name,
          content: Buffer.from(buffer),
        };
      })
    );

    // Prepare email content based on form type
    const emailContent = isRFPForm(validatedData)
      ? `Executive Coach RFP Submission

Name: ${name}
Email: ${email}
${validatedData.company ? `Company/Organization: ${validatedData.company}\n` : ''}
${validatedData.experience ? `\nCoaching Experience:\n${validatedData.experience}` : ''}
${validatedData.approach ? `\nCoaching Approach:\n${validatedData.approach}` : ''}
${validatedData.references ? `\nReferences:\n${validatedData.references}` : ''}
${files.length > 0 ? `\nAttachments: ${files.map(f => f.name).join(', ')}` : ''}`
      : `Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${(validatedData as ContactFormData).subject}

Message:
${(validatedData as ContactFormData).message}`;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: isRFPForm(validatedData)
        ? `Executive Coach RFP: ${name}${validatedData.company ? ` from ${validatedData.company}` : ''}`
        : `Contact Form: ${(validatedData as ContactFormData).subject}`,
      text: emailContent,
      attachments: attachments.length > 0 ? attachments : undefined,
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
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 