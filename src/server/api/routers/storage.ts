import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

const getDeleteSchema = z.object({
  objectID: z.string(),
});

const postSchema = z.object({
  objectID: z.string(),
  data: z.string(),
});

interface GetPostResponse {
  bucket: string;
  name: string;
  content_type: string;
  size: number;
  content_encoding: '';
  md5: string;
  media_link: string;
  created: string;
  updated: string;
}

type DeleteResponse = 1;

type APIResponse<T> =
  | {
      message: 'success';
      status: number;
      data: T;
    }
  | {
      message: 'error';
      status: number;
      data: string;
    };

async function callStorageAPI<T>(
  method: 'GET' | 'POST' | 'DELETE',
  objectID: string,
  body?: string,
): Promise<T> {
  const res = await fetch(
    `${process.env.NEBULA_API_URL}/storage/${process.env.NEBULA_API_STORAGE_BUCKET}/${objectID}`,
    {
      method,
      headers: {
        'x-api-key': process.env.NEBULA_API_KEY as string,
        'x-storage-key': process.env.NEBULA_API_STORAGE_KEY as string,
      },
      ...(body && { body }),
    },
  );

  const data = (await res.json()) as APIResponse<T>;

  if (data.message !== 'success') {
    throw new Error(data.data);
  }

  return data.data;
}

export const storageRouter = createTRPCRouter({
  get: publicProcedure.input(getDeleteSchema).query(async ({ input }) => {
    return callStorageAPI<GetPostResponse>('GET', input.objectID);
  }),
  delete: protectedProcedure.input(getDeleteSchema).query(async ({ input }) => {
    return callStorageAPI<GetPostResponse>('DELETE', input.objectID);
  }),
  post: protectedProcedure.input(postSchema).query(async ({ input }) => {
    return callStorageAPI<DeleteResponse>('POST', input.objectID, input.data);
  }),
});
