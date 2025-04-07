import { NextRequest, NextResponse } from 'next/server';
import { isValidFileSize, isValidFileType, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/file-validation';
import { removeBackground } from '@/lib/replicate';

// Constants for error responses
const BAD_REQUEST = 400;
const PAYLOAD_TOO_LARGE = 413;
const SERVER_ERROR = 500;

/**
 * API route for background removal
 * Accepts multipart/form-data with image file
 * Processes image with U²-Net via Replicate
 * Returns processed image as blob
 */
export async function POST(request: NextRequest) {
  try {
    // Verify that Content-Type is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data', statusCode: BAD_REQUEST },
        { status: BAD_REQUEST }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', statusCode: BAD_REQUEST },
        { status: BAD_REQUEST }
      );
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of 5MB`, statusCode: PAYLOAD_TOO_LARGE },
        { status: PAYLOAD_TOO_LARGE }
      );
    }

    // Validate file type
    if (!isValidFileType(file)) {
      return NextResponse.json(
        { error: `Invalid file type. Only JPEG and PNG images are accepted`, statusCode: BAD_REQUEST },
        { status: BAD_REQUEST }
      );
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Process image with Replicate's U²-Net model
    try {
      const processedImageResponse = await removeBackground(arrayBuffer, file.type);
      
      // Stream the result back to the client as a blob
      const processedImageBlob = await processedImageResponse.blob();
      return new NextResponse(processedImageBlob, {
        headers: {
          'Content-Type': processedImageResponse.headers.get('Content-Type') || 'image/png',
          'Content-Disposition': `attachment; filename="bg-removed-${file.name}"`,
        },
      });
    } catch (error: any) {
      console.error('Error processing image with Replicate:', error);
      return NextResponse.json(
        { error: 'Failed to process image with U²-Net model', statusCode: SERVER_ERROR },
        { status: SERVER_ERROR }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in remove-bg API:', error);
    return NextResponse.json(
      { error: 'Internal server error', statusCode: SERVER_ERROR },
      { status: SERVER_ERROR }
    );
  }
}

// App Router route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 20; 