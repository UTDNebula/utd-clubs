'use server';

import Alert from '@mui/material/Alert';
import { auth } from '@/server/auth';
import {
  SelectUserMetadataToClubsWithClub,
  SelectUserMetadataWithClubs,
} from '@/server/db/models';
import { api } from '@/trpc/server';
import DeleteAccount from './forms/DeleteAccount';
import JoinedClubs from './forms/JoinedClubs';
import UserInfo from './forms/UserInfo';
import SettingsHeader from './SettingsHeader';

async function SettingsForm({
  session,
}: {
  session: typeof auth.$Infer.Session;
}) {
  const user = session.user;

  let userData: SelectUserMetadataWithClubs | undefined = undefined;
  let joinedClubs: SelectUserMetadataToClubsWithClub[] | undefined = undefined;

  // Concurrently run both procedures
  await Promise.allSettled([
    api.user.metadata.byId({ id: user.id }),
    api.user.clubs.getMemberClubsMetadata(),
  ]).then(([userDataResult, joinedClubsResult]) => {
    if (userDataResult.status === 'fulfilled' && userDataResult.value) {
      userData = userDataResult.value;
    } else if (userDataResult.status === 'rejected') {
      throw new Error(
        `Failed to fetch user data. Has the \`user_metadata\` table been migrated?\n\n${userDataResult.reason}`,
      );
    }
    if (joinedClubsResult.status === 'fulfilled' && joinedClubsResult.value) {
      joinedClubs = joinedClubsResult.value;
    } else if (joinedClubsResult.status === 'rejected') {
      throw new Error(
        `Failed to fetch joined clubs. Has the \`user_metadata_to_clubs\` table been migrated?\n\n${joinedClubsResult.reason}`,
      );
    }
  });

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8">
      {(!userData || !joinedClubs) && (
        <Alert severity="error" variant="filled" className="rounded-lg">
          One or more panels were hidden because their associated data could not
          be found.
        </Alert>
      )}
      <SettingsHeader user={user} />
      {userData && <UserInfo user={userData} />}
      {joinedClubs && <JoinedClubs joinedClubs={joinedClubs} />}
      <DeleteAccount />
    </div>
  );
}

export default SettingsForm;
