'use server';

import { api } from '@src/trpc/server';
import type { APIResponse } from './storage';

export async function uploadToUploadURL(formData: FormData): Promise<APIResponse<string>> {
  try {
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return { message: 'error', status: 400, data: 'No file uploaded.' };
    }

    if (!file.type.startsWith('image/')) {
      return { message: 'error', status: 400, data: 'File must be an image.' };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { message: 'error', status: 400, data: 'File size must be less than 5MB.' };
    }

    const uploadUrlResponse = await api.storage.createUpload({ objectId: fileName, mime: file.type });

    if (uploadUrlResponse.message !== 'success') {
      return { message: 'error', status: 500, data: 'Failed to get upload URL.' };
    }

    const uploadUrl = uploadUrlResponse.data;

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'content-type': file.type,
        'x-goog-content-length-range': `0,${1000000}`
      },
      body: blob,
    });

    if (!uploadResponse.ok) {
      return { message: 'error', status: 500, data: 'Failed to upload file.' };
    }

    const fileResponse = await api.storage.get({ objectId: fileName });

    if (fileResponse.message !== 'success') {
      return { message: 'error', status: 500, data: 'Failed to get file URL.' };
    }

    return {
      message: 'success',
      status: 200,
      data: fileResponse.data.media_link,
    };
  } catch (error) {
    return { message: 'error', status: 500, data: error instanceof Error ? error.message : 'Failed to upload file.' };
  }
}
