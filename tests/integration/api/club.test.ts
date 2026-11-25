import { randomUUID } from 'node:crypto';
import { db } from '@/server/db';
import { InsertClub } from '@/server/db/models';
import { club } from '@/server/db/schema/club';
import { api } from '@/trpc/server';

describeWithSharedDb('CRUD a club in database', async () => {
  const suffix = randomUUID();

  const testClub: InsertClub = {
    name: `Test Club (${suffix})`,
    slug: `vitest-generated-club-${suffix}`,
    description: `Test club at UTD (${suffix})`,
  };

  beforeAll(async () => {
    const returned = await db.insert(club).values(testClub).returning();
    expect(returned).toHaveLength(1);
    const first = returned[0];
    expect(first?.name).toEqual(testClub.name);
  });

  test('bySlug', async () => {
    const foundClub = await api.club.bySlug({ slug: testClub.slug });
    expect(foundClub?.name).toEqual(testClub.name);
  });
});
