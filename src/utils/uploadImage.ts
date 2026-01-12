'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@src/trpc/react';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from './formSchemas';

export function useUploadToUploadURL() {
  const api = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      fileName,
    }: {
      file: File | null;
      fileName: string;
    }) => {
      if (!file) {
        throw new Error('No file uploaded.');
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('File must be an image.');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File must be less than 5MB');
      }

      const uploadUrlResponse = await queryClient.fetchQuery(
        api.storage.createUpload.queryOptions({
          objectId: fileName,
          mime: file.type,
        }),
      );

      if (uploadUrlResponse.message !== 'success') {
        throw new Error('Failed to get upload URL.');
      }

      const uploadUrl = uploadUrlResponse.data;

      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'content-type': file.type,
          'x-goog-content-length-range': `0,5000000`,
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file.');
      }

      const fileResponse = await queryClient.fetchQuery(
        api.storage.get.queryOptions({
          objectId: fileName,
        }),
      );

      if (fileResponse.message !== 'success') {
        throw new Error('Failed to get file URL.');
      }

      return fileResponse.data.media_link;
    },
  });
}
