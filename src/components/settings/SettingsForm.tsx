'use server';

import { Alert } from '@mui/material';
import PanelGroup from '@src/components/common/PanelGroup';
import PanelTOC from '@src/components/common/PanelTOC';
import { auth } from '@src/server/auth';
import {
  SelectUserMetadataToClubsWithClub,
  SelectUserMetadataWithClubs,
} from '@src/server/db/models';
import { api } from '@src/trpc/server';
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
    api.userMetadata.byId({ id: user.id }),
    api.club.getMemberClubsMetadata(),
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
    <div className="w-full max-w-6xl">
      <PanelGroup className="flex">
        <div>
          <PanelTOC className="min-w-48 sticky top-21" align="right" />
        </div>
        <div className="flex flex-col gap-8 grow">
          {(!userData || !joinedClubs) && (
            <Alert severity="error" variant="filled" className="rounded-lg">
              One or more panels were hidden because their associated data could
              not be found.
            </Alert>
          )}
          <SettingsHeader user={user} id="settings-header" />
          {userData && <UserInfo user={userData} id="user-info" />}
          {joinedClubs && (
            <JoinedClubs joinedClubs={joinedClubs} id="joined-clubs" />
          )}
          <DeleteAccount id="delete-account" />
        </div>
      </PanelGroup>
    </div>
  );
}

export default SettingsForm;
