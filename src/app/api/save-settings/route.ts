import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

export async function POST(req: Request) {
  try {
    const settings = await req.json();
    console.log('Received settings to save:', settings);

    // Validate settings
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    // Ensure all fields are present and properly formatted
    const validatedSettings: Settings = {
      upiId: (settings.upiId || '').trim(),
      upiName: (settings.upiName || '').trim(),
      qrCode: settings.qrCode || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Validated settings:', validatedSettings);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('settings');

    // Update or insert settings
    const result = await collection.updateOne(
      {}, // Match any document
      { $set: validatedSettings },
      { upsert: true }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to save settings');
    }

    return NextResponse.json({ 
      success: true,
      settings: validatedSettings
    });

  } catch (error) {
    console.error('Settings save error:', error);
    return NextResponse.json({ 
      error: 'Failed to save settings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 