import { notFound, redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import CreateEventForm from './CreateEventForm';

const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const params = await props.params;
  const session = await getServerAuthSession();
  if (!session) {
    redirect(signInRoute(`manage/${params.clubId}/create`));
  }

  const officerClubs = await api.club.getOfficerClubs();
  const currentClub = officerClubs.filter((val) => {
    return val.id == params.clubId;
  })[0];
  if (!currentClub) {
    notFound();
  }

  return (
    <main className="h-screen">
      <Header />
      <div className="flex flex-row justify-between gap-20 px-5">
        <CreateEventForm clubId={currentClub.id} officerClubs={officerClubs} />
      </div>
    </main>
  );
};
export default Page;
