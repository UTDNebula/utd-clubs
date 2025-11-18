'use server';

import { getUploadURL, callStorageAPI } from 'src/utils/storage';

export async function uploadImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    const clubId = formData.get('clubId') as string;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    const objectID = `${clubId}/events/${fileName}`;

    // Get signed upload URL
    const uploadUrlResponse = await getUploadURL(objectID, file.type);

    if (uploadUrlResponse.message === 'error') {
      return { success: false, error: 'Failed to get upload URL' };
    }

    const uploadUrl = uploadUrlResponse.data;

    // Convert file to blob
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // Upload to cloud storage using the signed URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: blob,
    });

    if (!uploadResponse.ok) {
      return { success: false, error: 'Failed to upload file' };
    }

    // Get the public URL
    const fileResponse = await callStorageAPI('GET', objectID);

    if (fileResponse.message === 'error') {
      return { success: false, error: 'Failed to get file URL' };
    }

    return {
      success: true,
      url: fileResponse.data.media_link,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file',
    };
  }
}