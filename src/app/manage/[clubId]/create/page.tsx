import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';

const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const params = await props.params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(await signInRoute(`manage/${params.clubId}/create`));
  }

  const officerClubs = await api.club.getOfficerClubs();
  const currentClub = officerClubs.filter((val) => {
    return val.id == params.clubId;
  })[0];
  const club = currentClub;

  if (!currentClub || !club) {
    notFound();
  }

  return (
    <main className="h-screen">
      <ClubManageHeader
        club={club}
        path={[{ text: 'Events' }, { text: 'Create' }]}
      ></ClubManageHeader>
      <div className="flex flex-row justify-between gap-20 px-5">
        <EventForm clubId={currentClub.id} officerClubs={officerClubs} />
      </div>
    </main>
  );
};
export default Page;
