import { and, eq, or } from 'drizzle-orm';
import { cache } from 'react';
import { type personalCats } from '@src/constants/categories';
import { getServerAuthSession } from '@src/server/auth';
import { db } from '@src/server/db';
import { admin } from '@src/server/db/schema/admin';
import { userMetadataToClubs } from '@src/server/db/schema/users';

export const getUserSidebarCapabilities = cache(async () => {
  const session = await getServerAuthSession();
  const capabilites: (typeof personalCats)[number][] = [];
  if (!session) return capabilites;
  if (
    await db.query.userMetadataToClubs.findFirst({
      where: and(
        eq(userMetadataToClubs.userId, session.user.id),
        or(
          eq(userMetadataToClubs.memberType, 'Officer'),
          eq(userMetadataToClubs.memberType, 'President'),
        ),
      ),
    })
  ) {
    capabilites.push('Manage Clubs');
  }
  if (
    (
      await db.query.admin.findMany({
        where: eq(admin.userId, session.user.id),
      })
    ).length === 1
  )
    capabilites.push('Admin');
  return capabilites;
});
