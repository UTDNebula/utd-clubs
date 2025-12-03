import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@src/server/auth';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import Collaborators from './(forms)/Collaborators';
import Contacts from './(forms)/Contacts';
import Details from './(forms)/Details';
import Officers from './(forms)/Officers';

const ClubManageForm = async ({
  club,
}: {
  club: SelectClub & { contacts: SelectContact[] };
}) => {
  const clubId = club.id;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute(`manage/${clubId}/edit/officers`));
  const role = await api.club.memberType({ id: clubId });
  const officers = await api.club.getOfficers({ id: clubId });
  const listedOfficers = await api.club.getListedOfficers({ id: clubId });
  const officersMapped = officers.map((officer) => ({
    userId: officer.userId,
    name: officer.userMetadata.firstName + ' ' + officer.userMetadata.lastName,
    locked: officer.memberType == 'President' || role == 'Officer',
    position: officer.memberType as 'President' | 'Officer',
  }));

  return (
    <div className="flex flex-col gap-8">
      <Details club={club} />
      <Officers club={club} officers={listedOfficers} />
      <Contacts club={club}></Contacts>
      <Collaborators club={club} officers={officersMapped} />
    </div>
  );
};

export default ClubManageForm;
