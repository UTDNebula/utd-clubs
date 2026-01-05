'use server';

import { eq } from 'drizzle-orm';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import { userMetadata } from '@src/server/db/schema/users';
import Clubs from './forms/Clubs';
import DeleteAccount from './forms/DeleteAccount';
import UserInfo from './forms/UserInfo';
import SettingsHeader from './SettingsHeader';

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

  const formatted = joinedClubs.map(({ club }) => club);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <SettingsHeader />
      <UserInfo user={userData} clubs={formatted} />
      <Clubs clubs={formatted} />
      <DeleteAccount />
    </div>
  );
}

export default SettingsForm;
