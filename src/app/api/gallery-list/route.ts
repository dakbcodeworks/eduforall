import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

// Debug: Log Cloudinary configuration
console.log('Cloudinary Config Check:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  has_api_key: !!process.env.CLOUDINARY_API_KEY,
  has_api_secret: !!process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Force dynamic to ensure we get fresh data
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Optimize search query with specific fields and caching
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'gallery/',
      max_results: 100,
      fields: 'public_id,secure_url,resource_type,format,width,height,bytes,created_at'
    });

    if (!result || !('resources' in result)) {
      throw new Error('Invalid response from Cloudinary');
    }

    const resources = result.resources;

    return NextResponse.json({
      success: true,
      images: resources.map((resource: { secure_url: string }) => resource.secure_url),
      count: resources.length
    });

  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
} 