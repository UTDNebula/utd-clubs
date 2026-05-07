import { z } from 'zod';
import { adminProcedure, createTRPCRouter } from '@src/server/api/trpc';

export const emailRouter = createTRPCRouter({
  queue: adminProcedure
    .input(
      z.object({
        to: z.array(z.email()),
        subject: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const email = {
        to: input.to,
        from: 'UTD Clubs Admin',
        subject: input.subject,
        body: input.body,
      };
      const res = await fetch(`${process.env.NEBULA_API_URL}/email/queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-email-queue-key': process.env.NEBULA_API_EMAIL_KEY ?? '',
        },
        body: JSON.stringify(email),
      });

      const data = await res.json().catch(() => null);

      return {
        status: res.status,
        data,
      };
    }),
});
