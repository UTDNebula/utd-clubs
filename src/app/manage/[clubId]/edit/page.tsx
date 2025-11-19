import { notFound } from 'next/navigation';
import { BlueBackButton } from '@src/components/backButton';
import Header from '@src/components/header/BaseHeader';
import { api } from '@src/trpc/server';
import EditClubForm from './EditClubForm';
import EditContactForm from './EditContactForm';

export default async function Page(props: {
  params: Promise<{ clubId: string }>;
}) {
  const params = await props.params;

  const { clubId } = params;

  const club = await api.club.byId({ id: clubId });
  if (!club) notFound();
  return (
    <main>
      <div className="">
        <Header />
        <div className="flex h-full w-full flex-col gap-y-5 p-5">
          <BlueBackButton />
          <EditClubForm club={club} />
          <EditContactForm club={club} />
        </div>
      </div>
    </main>
  );
}
