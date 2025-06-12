import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

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
    const resourcesToDelete = resources.filter((resource: CloudinaryResource) => 
      images.includes(resource.secure_url)
    );

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

    // Get updated gallery list
    const { resources: updatedResources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'gallery/',
      max_results: 500
    });

    return NextResponse.json({
      success: true,
      images: updatedResources.map((resource: CloudinaryResource) => resource.secure_url),
      count: updatedResources.length
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    );
  }
} 