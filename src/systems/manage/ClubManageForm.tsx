import { headers } from 'next/headers';
import { auth } from '@/server/auth';
import type { SelectClub, SelectContact } from '@/server/db/models';
import { api } from '@/trpc/server';
import Calendar from './forms/Calendar';
import Collaborators from './forms/Collaborators';
import Contacts from './forms/Contacts';
import DeleteClub from './forms/DeleteClub';
import Details from './forms/Details';
import MembershipForms from './forms/MembershipForms';
import Officers from './forms/Officers';
import Slug from './forms/Slug';
import LeadershipChange from './LeadershipChange';
import NotApproved from './NotApproved';
import Resources from './Resources';

const ClubManageForm = async ({
  club,
}: {
  club: SelectClub & { contacts: SelectContact[] };
}) => {
  const clubId = club.id;
  const awaitedHeaders = await headers();
  const session = await auth.api.getSession({ headers: awaitedHeaders });

  const [
    listedOfficers,
    listedMembershipForms,
    awaitedRole,
    officers,
    awaitedGoogleAccount,
  ] = await Promise.all([
    api.club.getListedOfficers({ id: clubId }),
    api.club.clubForms({ id: clubId }),
    api.club.memberType({ id: clubId }),
    api.club.getOfficers({ id: clubId }),
    auth.api.listUserAccounts({
      headers: awaitedHeaders,
      query: { user: { id: session!.user.id } },
    }),
  ]);

  const role = awaitedRole as 'President' | 'Officer';

  const googleAccount = awaitedGoogleAccount.find(
    (acc) => acc.providerId === 'google',
  );
  const hasScopesForCalendarSync =
    !!googleAccount &&
    googleAccount.scopes.includes(
      'https://www.googleapis.com/auth/calendar.events.public.readonly',
    ) &&
    googleAccount.scopes.includes(
      'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    );

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8">
      {club.approved !== 'approved' && <NotApproved status={club.approved} />}
      {/*TODO: Update range to display banner for a month before the semester ends and until the next semester starts*/}
      {club.approved === 'approved' &&
        (club.updatedAt == null || club.updatedAt < new Date(2026, 4, 5)) &&
        new Date() < new Date(2026, 7, 24) && (
          <LeadershipChange clubId={club.id} />
        )}
      <Details club={club} />
      <Calendar
        club={club}
        hasScopes={hasScopesForCalendarSync}
        userEmail={session?.user.email as string}
      />
      <Slug club={club} role={role} />
      <Officers club={club} listedOfficers={listedOfficers} />
      <Contacts club={club} />
      <MembershipForms
        club={club}
        listedMembershipForms={listedMembershipForms}
      />
      <Collaborators
        club={club}
        officers={officers}
        role={role}
        userId={session?.user.id as string}
      />
      <Resources />
      {role === 'President' && <DeleteClub view="manage" club={club} />}
    </div>
  );
};

export default ClubManageForm;
