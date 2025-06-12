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
  secure_url: string;
  public_id: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Upload files to Cloudinary with optimized settings
    const uploadPromises = files.map(async (file: FormDataEntryValue) => {
      if (!(file instanceof File)) {
        throw new Error('Invalid file type');
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary with optimized settings
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'gallery',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' },
              { width: 'auto', crop: 'scale' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Get the updated gallery list with optimized query
    const galleryResult = await cloudinary.search
      .expression('folder:gallery/*')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    return NextResponse.json({
      success: true,
      images: galleryResult.resources.map((resource: CloudinaryResource) => {
        const url = resource.secure_url;
        return url.replace('/upload/', '/upload/w_auto,q_auto,f_auto/');
      }),
      count: galleryResult.resources.length
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
} 