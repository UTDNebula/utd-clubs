import { callStorageAPI } from '@src/utils/storage';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const getDeleteSchema = z.object({
  objectID: z.string(),
});

const postSchema = z.object({
  objectID: z.string(),
  data: z.file(),
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
  post: protectedProcedure.input(postSchema).query(async ({ input }) => {
    const data = await callStorageAPI('POST', input.objectID, input.data);
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
