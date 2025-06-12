import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/lib/mongodb';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('settings');

    // Get current settings to find the QR code URL
    const settings = await collection.findOne({});
    if (settings?.qrCode) {
      // Extract public_id from Cloudinary URL
      const urlParts = settings.qrCode.split('/');
      const publicId = urlParts[urlParts.length - 1].split('.')[0];
      
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);
    }

    // Update settings to remove QR code
    const result = await collection.updateOne(
      {}, // Match any document
      { 
        $set: { 
          qrCode: null,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to remove QR code from database');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove QR code:', error);
    return NextResponse.json({ error: 'Failed to remove QR code' }, { status: 500 });
  }
} 