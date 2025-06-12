import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { defaultSettings } from '@/models/Settings';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('settings');

    // Get the first settings document
    const settings = await collection.findOne({});

    if (!settings) {
      // If no settings exist, return default settings
      return NextResponse.json(defaultSettings);
    }

    // Remove MongoDB specific fields
    const { ...cleanSettings } = settings;

    return NextResponse.json(cleanSettings);
  } catch (error) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
} 