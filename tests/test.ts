import { describe, expect, test } from '@jest/globals';
import { eq } from 'drizzle-orm';
import { db } from '@src/server/db';
import { type InsertClub } from '@src/server/db/models';
import { club } from '@src/server/db/schema/club';

describe('This should create a club on Neon', () => {
  test('Should create a new club', async () => {
    const newClub: InsertClub = {
      description: 'Computer science club at UTD',
      name: 'INTERNAL JEST TEST ORG',
      slug: 'internal-jest-test-org',
    };

    const returned = await db.insert(club).values(newClub).returning();
    expect(returned.length === 1);
    const first = returned[0];
    expect(first?.name).toEqual('INTERNAL JEST TEST ORG');
  });
});

describe('This should delete the created club', () => {
  test('Should delete the created club', async () => {
    const returned = await db
      .delete(club)
      .where(eq(club.slug, 'internal-jest-test-org'))
      .returning();
    expect(returned.length === 1);
    const first = returned[0];
    expect(first?.name).toEqual('INTERNAL JEST TEST ORG');
  });
});
