import { headers } from 'next/headers';
import { auth } from '@src/server/auth';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { api } from '@src/trpc/server';
import Calendar from './(forms)/Calendar';
import Collaborators from './(forms)/Collaborators';
import Contacts from './(forms)/Contacts';
import DeleteClub from './(forms)/DeleteClub';
import Details from './(forms)/Details';
import MembershipForms from './(forms)/MembershipForms';
import Officers from './(forms)/Officers';
import Slug from './(forms)/Slug';
import NotApproved from './NotApproved';

const ClubManageForm = async ({
  club,
}: {
  club: SelectClub & { contacts: SelectContact[] };
}) => {
  const clubId = club.id;

  const listedOfficers = await api.club.getListedOfficers({ id: clubId });
  const listedMembershipForms = await api.club.clubForms({ id: clubId });
  const role = (await api.club.memberType({ id: clubId })) as
    | 'President'
    | 'Officer';
  const officers = await api.club.getOfficers({ id: clubId });
  const session = await auth.api.getSession({ headers: await headers() });
  const googleAccount = (
    await auth.api.listUserAccounts({
      headers: await headers(),
      query: { user: { id: session!.user.id } },
    })
  ).find((acc) => acc.providerId === 'google');
  const hasScopesForCalendarSync =
    !!googleAccount &&
    googleAccount.scopes.includes(
      'https://www.googleapis.com/auth/calendar.events.public.readonly',
    ) &&
    googleAccount.scopes.includes(
      'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    );
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      {club.approved !== 'approved' && <NotApproved status={club.approved} />}
      <Details club={club} />
      <Calendar
        club={club}
        hasScopes={hasScopesForCalendarSync}
        userEmail={session?.user.email as string}
      />
      <Slug club={club} role={role} />
      <Officers club={club} listedOfficers={listedOfficers} />
      <MembershipForms
        club={club}
        listedMembershipForms={listedMembershipForms}
      />
      <Contacts club={club} />
      <Collaborators
        club={club}
        officers={officers}
        role={role}
        userId={session?.user.id as string}
      />
      {role === 'President' && <DeleteClub view="manage" club={club} />}
    </div>
  );
};

export default ClubManageForm;
