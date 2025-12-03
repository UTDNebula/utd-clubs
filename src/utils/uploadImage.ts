'use server';

import { callStorageAPI, getUploadURL } from 'src/utils/storage';

export async function uploadImage(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    const clubId = formData.get('clubId') as string;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    const objectID = `${clubId}/events/${fileName}`;

    const uploadUrlResponse = await getUploadURL(objectID, file.type);

    if (uploadUrlResponse.message === 'error') {
      return { success: false, error: 'Failed to get upload URL' };
    }

    const uploadUrl = uploadUrlResponse.data;

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

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
