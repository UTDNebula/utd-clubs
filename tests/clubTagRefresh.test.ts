import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { z } from 'zod';
import type { Context } from '@/server/api/trpc';

// Keep these router tests isolated from Neon, OAuth, and image storage.
const write = jest.fn<() => Promise<void>>();
const refresh = jest.fn<(view: unknown) => Promise<void>>();
const storage = jest.fn<(method: string, objectId: string) => Promise<void>>();
const findAdmin = jest.fn<() => Promise<unknown>>();
const findMember = jest.fn<() => Promise<unknown>>();
const db = {
  delete: jest.fn(() => ({ where: write })),
  update: jest.fn(() => ({ set: () => ({ where: write }) })),
  refreshMaterializedView: refresh,
  query: {
    admin: { findFirst: findAdmin },
    userMetadataToClubs: { findFirst: findMember },
  },
};

jest.unstable_mockModule('@/server/db', () => ({ db }));
jest.unstable_mockModule('@/server/auth', () => ({ auth: {} }));
jest.unstable_mockModule('@/lib/utils/storage', () => ({
  callStorageAPI: storage,
}));
jest.unstable_mockModule('googleapis', () => ({ google: {} }));
jest.unstable_mockModule('@/lib/modules/googleCalendar', () => ({
  syncCalendar: jest.fn(),
  watchCalendar: jest.fn(),
}));
jest.unstable_mockModule('@/lib/modules/googleOAuth', () => ({
  getGoogleAccessToken: jest.fn(),
}));
jest.unstable_mockModule('@/systems/manage/forms/Details', () => ({
  editClubDetailsSchema: z.object({}),
}));
jest.unstable_mockModule('@/systems/manage/forms/Slug', () => ({
  editSlugSchema: z.object({}),
}));

const { default: adminRouter } = await import('@/server/api/routers/admin');
const { default: manageRouter } =
  await import('@/server/api/routers/club/clubManageRouter');
const { usedTags } = await import('@/server/db/schema/club');

const context = {
  db: db as unknown as Context['db'],
  session: { user: { id: 'test-president' } } as Context['session'],
};
const input = { clubId: 'test-club' };
const admin = adminRouter.createCaller(context);
const manage = manageRouter.createCaller(context);
const mutations = [
  ['admin delete', () => admin.deleteClub(input)],
  ['manager delete', () => manage.delete(input)],
  ['mark deleted', () => manage.markDeleted(input)],
  ['restore', () => manage.restore(input)],
  [
    'admin status change',
    () => admin.changeClubStatus({ ...input, status: 'deleted' }),
  ],
] as const;

beforeEach(() => {
  jest.clearAllMocks();
  write.mockReset().mockResolvedValue(undefined);
  refresh.mockReset().mockResolvedValue(undefined);
  storage.mockReset().mockResolvedValue(undefined);
  findAdmin.mockReset().mockResolvedValue({ userId: 'test-president' });
  findMember.mockReset().mockResolvedValue({ memberType: 'President' });
});

describe.each(mutations)('%s', (_name, mutate) => {
  test('waits for the database write before refreshing tags and returning', async () => {
    const writing = Promise.withResolvers<void>();
    const written = Promise.withResolvers<void>();
    const refreshing = Promise.withResolvers<void>();
    const refreshed = Promise.withResolvers<void>();
    write.mockImplementation(() => {
      writing.resolve();
      return written.promise;
    });
    refresh.mockImplementation(() => {
      refreshing.resolve();
      return refreshed.promise;
    });

    let finished = false;
    const result = mutate().then(() => {
      finished = true;
    });
    await writing.promise;
    expect(refresh).not.toHaveBeenCalled();
    written.resolve();
    await refreshing.promise;
    expect(finished).toBe(false);
    expect(storage).not.toHaveBeenCalled();
    refreshed.resolve();
    await result;
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledWith(usedTags);
  });

  test('does not refresh tags or remove images when the database write fails', async () => {
    write.mockRejectedValueOnce(new Error('write failed'));
    await expect(mutate()).rejects.toThrow('write failed');
    expect(refresh).not.toHaveBeenCalled();
    expect(storage).not.toHaveBeenCalled();
  });

  test('propagates refresh failures', async () => {
    refresh.mockRejectedValueOnce(new Error('refresh failed'));
    await expect(mutate()).rejects.toThrow('refresh failed');
  });

  test('rejects users without the required role before changing data', async () => {
    findAdmin.mockResolvedValue(undefined);
    findMember.mockResolvedValue({ memberType: 'Member' });
    await expect(mutate()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(write).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
    expect(storage).not.toHaveBeenCalled();
  });
});

describe.each(mutations.slice(0, 2))('%s image cleanup', (_name, mutate) => {
  test('deletes both club images after the tags refresh', async () => {
    await mutate();
    expect(storage).toHaveBeenCalledTimes(2);
    expect(storage).toHaveBeenCalledWith('DELETE', 'test-club-profile');
    expect(storage).toHaveBeenCalledWith('DELETE', 'test-club-banner');
  });

  test('still refreshes tags if image storage fails', async () => {
    storage.mockRejectedValueOnce(new Error('storage failed'));
    await expect(mutate()).rejects.toThrow('storage failed');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledWith(usedTags);
  });
});

test('rejects unauthenticated deletion before changing data', async () => {
  const anonymous = { ...context, session: null };
  await expect(
    adminRouter.createCaller(anonymous).deleteClub(input),
  ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  await expect(
    manageRouter.createCaller(anonymous).delete(input),
  ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  expect(write).not.toHaveBeenCalled();
  expect(refresh).not.toHaveBeenCalled();
  expect(storage).not.toHaveBeenCalled();
});
