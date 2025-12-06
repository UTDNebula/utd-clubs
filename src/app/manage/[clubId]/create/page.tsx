import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import Header from '@src/components/header/BaseHeader';
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
  if (!currentClub) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex flex-row justify-between gap-20 p-4">
        <EventForm clubId={currentClub.id} officerClubs={officerClubs} />
      </main>
    </>
  );
};
export default Page;
