'use server';

import { eq } from 'drizzle-orm';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import { userMetadata } from '@src/server/db/schema/users';
import FormCard from './FormCard';

async function SettingsForm({
  session,
}: {
  session: typeof auth.$Infer.Session;
}) {
  const user = session.user;

  const userData = await db.query.userMetadata.findFirst({
    where: eq(userMetadata.id, user.id),
  });
  if (!userData) return null;
  const joinedClubs = await db.query.userMetadataToClubs.findMany({
    where: (joinTable) => eq(joinTable.userId, user.id),
    with: { club: true },
  });

  return (
    <div className="m-auto w-full rounded-xl p-4">
      <div>
        <div className="h-24 rounded-t-3xl bg-linear-to-r from-[#5A49F7] from-[4.36%] via-[#9403D8] via-[49.74%] to-[#FD9365] p-6" />
        <div className="bg-white dark:bg-neutral-900 p-6">
          <h1 className="font-display py-2 text-3xl font-semibold">Settings</h1>
          <FormCard user={userData} joinedClubs={joinedClubs} />
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;
