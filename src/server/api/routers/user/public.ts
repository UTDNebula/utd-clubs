import { eq, sql } from 'drizzle-orm';
import { user as users } from '@/server/db/schema/auth';
import { userMetadata } from '@/server/db/schema/users';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { nameOrEmailSchema } from './schemas';

export const userPublicRouter = createTRPCRouter({
  searchByNameOrEmail: publicProcedure
    .input(nameOrEmailSchema)
    .query(async ({ input, ctx }) => {
      const q = `%${input.search}%`;

      const result = await ctx.db
        .select({
          id: users.id,
          email: users.email,
          firstName: userMetadata.firstName,
          lastName: userMetadata.lastName,
        })
        .from(users)
        .leftJoin(userMetadata, eq(userMetadata.id, users.id))
        .where(
          sql`
            CONCAT(${userMetadata.firstName}, ' ', ${userMetadata.lastName}) ILIKE ${q}
            OR ${users.email} ILIKE ${q}
            OR ${userMetadata.contactEmail} ILIKE ${q}
          `,
        );

      return result;
    }),
});
