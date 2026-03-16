import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getCachedGallery = unstable_cache(
  async () => {
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
    return {
      images: resources.map((resource: { secure_url: string }) => {
        const url = resource.secure_url;
        // Apply w_auto,q_auto,f_auto transformations for optimal loading
        return url.replace('/upload/', '/upload/w_auto,q_auto,f_auto/');
      }),
      count: resources.length
    };
  },
  ['global-gallery'],
  { revalidate: 3600, tags: ['gallery'] }
);

export async function GET() {
  try {
    const data = await getCachedGallery();

    return NextResponse.json({
      success: true,
      images: data.images,
      count: data.count
    });

  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
} 