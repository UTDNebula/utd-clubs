import { createTRPCRouter, publicProcedure } from '../trpc';
import { forms } from '@src/server/db/schema/forms';
import { feedbackFormSchema } from '@src/utils/formSchemas';

export const formRouter = createTRPCRouter({
  sendForm: publicProcedure
    .input(feedbackFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { rating, likes, dislikes, features, submit_on } = input;

      await ctx.db
        .insert(forms)
        .values({
          rating: rating,
          likes: likes,
          dislikes: dislikes,
          features: features,
          submit_on: submit_on,
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    }),
});
