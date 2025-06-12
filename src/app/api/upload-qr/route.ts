import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('qr');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'qr-codes',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      ).end(buffer);
    });

    if (!result || !result.secure_url) {
      throw new Error('Upload failed - no URL returned');
    }

    // Save Cloudinary URL to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('settings');

    // Update the QR code in settings
    const updateResult = await collection.updateOne(
      {}, // Match any document
      { 
        $set: { 
          qrCode: result.secure_url,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    if (!updateResult.acknowledged) {
      throw new Error('Failed to save QR code URL to database');
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url
    });

  } catch (error) {
    console.error('QR code upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload QR code' },
      { status: 500 }
    );
  }
} 