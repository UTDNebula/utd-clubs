import { TRPCError } from '@trpc/server';
import { callStorageAPI, getUploadURL } from '@/common/utils/storage';
import { createTRPCRouter, authedProcedure, publicProcedure } from '@/server/api/trpc';
import { getDeleteSchema, createUploadSchema } from './inputSchemas';

const storageRouter = createTRPCRouter({
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
  delete: authedProcedure.input(getDeleteSchema).query(async ({ input }) => {
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
  createUpload: authedProcedure
    .input(createUploadSchema)
    .query(async ({ input }) => {
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

export default storageRouter;
