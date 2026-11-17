import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { InsertClub } from '@/server/db/models';
import { club } from '@/server/db/schema/club';

describe('CRUD a club in database', () => {
  const suffix = randomUUID();

  const testClub: InsertClub = {
    name: `Test Club (${suffix})`,
    slug: `vitest-generated-club-${suffix}`,
    description: `Test club at UTD (${suffix})`,
  };

  test('Create club', async () => {
    const returned = await db.insert(club).values(testClub).returning();
    expect(returned.length === 1);
    const first = returned[0];
    expect(first?.name).toEqual(testClub.name);
  });

  test('Delete created club', async () => {
    const returned = await db
      .delete(club)
      .where(eq(club.slug, testClub.slug))
      .returning();
    expect(returned.length === 1);
    const first = returned[0];
    expect(first?.name).toEqual(testClub.name);
  });
});
