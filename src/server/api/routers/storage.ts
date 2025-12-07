import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { callStorageAPI, getUploadURL } from '@src/utils/storage';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const getDeleteSchema = z.object({
  objectId: z.string(),
});

const createUploadSchema = z.object({
  objectId: z.string(),
  mime: z.string(),
});
export const storageRouter = createTRPCRouter({
  get: publicProcedure.input(getDeleteSchema).query(async ({ input }) => {
    const data = await callStorageAPI('GET', input.objectId);
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
    const data = await callStorageAPI('DELETE', input.objectId);
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
      const data = await getUploadURL(input.objectId, input.mime);
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
