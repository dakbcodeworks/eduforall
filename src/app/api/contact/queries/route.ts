import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('admin-panel'); // Corrected database name
    const collection = db.collection('contact_queries');

    const queries = await collection.find({}).sort({ timestamp: -1 }).toArray();

    return NextResponse.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    return NextResponse.json({ error: 'Failed to fetch queries' }, { status: 500 });
  }
} 