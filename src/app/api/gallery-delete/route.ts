import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { revalidateTag } from 'next/cache';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided for deletion' },
        { status: 400 }
      );
    }

    // Get all resources in the gallery folder
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'gallery/',
      max_results: 500
    });

    // Find matching resources by URL
    // Handle the fact that frontend might send the optimized w_auto URL
    const cleanImageUrlForMatching = (url: string) => {
      if (!url.includes('/upload/')) return url;
      // Extract the part after /upload/ that contains transformations
      const parts = url.split('/upload/');
      if (parts.length !== 2) return url;

      const pathAfterUpload = parts[1];
      const nextSlashIndex = pathAfterUpload.indexOf('/');

      // If there are transformations, strip them (e.g., w_auto,q_auto,f_auto/)
      if (nextSlashIndex > 0 && pathAfterUpload.includes(',')) {
        return parts[0] + '/upload/' + pathAfterUpload.substring(nextSlashIndex + 1);
      }
      return url;
    };

    const cleanedInputImages = images.map(cleanImageUrlForMatching);

    const resourcesToDelete = resources.filter((resource: CloudinaryResource) => {
      const dbUrlClean = cleanImageUrlForMatching(resource.secure_url);
      return cleanedInputImages.includes(dbUrlClean) || images.includes(resource.secure_url);
    });

    if (resourcesToDelete.length === 0) {
      return NextResponse.json(
        { error: 'No matching images found in gallery' },
        { status: 404 }
      );
    }

    // Delete each matching resource
    const deletePromises = resourcesToDelete.map((resource: CloudinaryResource) =>
      cloudinary.uploader.destroy(resource.public_id, {
        resource_type: 'image',
        invalidate: true
      })
    );

    await Promise.all(deletePromises);

    revalidateTag('gallery');

    return NextResponse.json({
      success: true,
      message: 'Deletion successful'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    );
  }
} 