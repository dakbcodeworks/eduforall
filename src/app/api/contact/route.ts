import { NextResponse } from 'next/server';
import xss from 'xss';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import clientPromise from '@/lib/mongodb';

// Strict Zod schema for payload validation
const contactSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  phoneNumber: z.string().min(8, "Phone number is too short").max(20, "Phone number is too long"),
  subject: z.string().min(2, "Subject is too short").max(200, "Subject is too long"),
  message: z.string().min(10, "Message is too short").max(2000, "Message is too long"),
});

// Upstash Redis rate limiter (5 requests per 1 minute window globally)
// Fallback gracefully if Redis config is missing in development
const ratelimit = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: false,
  })
  : null;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';

    if (ratelimit) {
      const { success } = await ratelimit.limit(`ratelimit_contact_${ip}`);
      if (!success) {
        return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    }

    const formData = await request.json();

    // Zod validation
    const parsedData = contactSchema.safeParse(formData);
    if (!parsedData.success) {
      return NextResponse.json({
        message: 'Invalid input data.',
        errors: parsedData.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const { fullName, phoneNumber, subject, message } = parsedData.data;

    // Input sanitization against stored XSS
    const sanitizedFullName = xss(fullName);
    const sanitizedPhoneNumber = xss(phoneNumber);
    const sanitizedSubject = xss(subject);
    const sanitizedMessage = xss(message);

    const client = await clientPromise;
    const db = client.db('admin-panel'); // Corrected database name
    const collection = db.collection('contact_queries');

    const result = await collection.insertOne({
      fullName: sanitizedFullName,
      phoneNumber: sanitizedPhoneNumber,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      timestamp: new Date(),
    });

    console.log('Form data successfully written to MongoDB:', result.insertedId);

    return NextResponse.json({ message: 'Form data submitted successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error processing form submission to MongoDB:', error);
    return NextResponse.json({ message: 'Failed to submit form data.' }, { status: 500 });
  }
}  