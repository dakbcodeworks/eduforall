import { NextResponse } from 'next/server';

import clientPromise from '../../../lib/mongodb';


export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { fullName, phoneNumber, subject, message } = formData;

    // Basic validation
    if (!fullName || !phoneNumber || !subject || !message) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('admin-panel'); // Corrected database name
    const collection = db.collection('contact_queries');

    const result = await collection.insertOne({
      fullName,
      phoneNumber,
      subject,
      message,
      timestamp: new Date(),
    });

    console.log('Form data successfully written to MongoDB:', result.insertedId);

    return NextResponse.json({ message: 'Form data submitted successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error processing form submission to MongoDB:', error);
    return NextResponse.json({ message: 'Failed to submit form data.' }, { status: 500 });
  }
} 