import { callStorageAPI, getUploadURL } from '@src/utils/storage';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure,publicProcedure } from '../trpc';

const getDeleteSchema = z.object({
  objectID: z.string(),
});

const createUploadSchema = z.object({
  objectID: z.string(),
  mime: z.string(),
});
export const storageRouter = createTRPCRouter({
  get: publicProcedure.input(getDeleteSchema).query(async ({ input }) => {
    const data = await callStorageAPI('GET', input.objectID);
    if (data.message !== 'success') {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Nebula API errored on request',
        cause: data,
      });
    }
    return data;
  }),
  delete: protectedProcedure.input(getDeleteSchema).query(async ({ input }) => {
    const data = await callStorageAPI('DELETE', input.objectID);
    if (data.message !== 'success') {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Nebula API errored on request',
        cause: data,
      });
    }
    return data;
  }),
  createUpload: protectedProcedure
    .input(createUploadSchema)
    .mutation(async ({ input }) => {
      const data = await getUploadURL(input.objectID, input.mime);
      if (data.message !== 'success') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Nebula API errored on request',
          cause: data,
        });
      }
      return data;
    }),
});
