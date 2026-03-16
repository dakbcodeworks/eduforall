import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { defaultSettings } from '@/models/Settings';

export const revalidate = 3600;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('settings');

    // Get the global settings document by explicit ID
    const settings = await collection.findOne({ _id: 'global-settings' as any });

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