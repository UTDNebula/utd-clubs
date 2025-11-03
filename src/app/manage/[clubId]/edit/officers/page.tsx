import { redirect } from 'next/navigation';
import { BlueBackButton } from '@src/components/backButton';
import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import EditListedOfficerForm from './EditListedOfficerForm';
import EditOfficerForm from './EditOfficerForm';

export default async function Page(props: {
  params: Promise<{ clubId: string }>;
}) {
  const params = await props.params;

  const { clubId } = params;

  const session = await getServerAuthSession();
  if (!session) redirect(signInRoute(`manage/${clubId}/edit/officers`));
  const role = await api.club.memberType({ id: clubId });
  const officers = await api.club.getOfficers({ id: clubId });
  const listedOfficers = await api.club.getListedOfficers({ id: clubId });

  const mapped = officers.map((officer) => ({
    userId: officer.userId,
    name: officer.userMetadata.firstName + ' ' + officer.userMetadata.lastName,
    locked: officer.memberType == 'President' || role == 'Officer',
    position: officer.memberType as 'President' | 'Officer',
  }));

  return (
    <main className="h-full">
      <Header />
      <div className="flex flex-col gap-y-2 px-5">
        <BlueBackButton />
        <h1 className="text-royal text-2xl font-extrabold">
          Edit club Collaborators
        </h1>
        <EditOfficerForm clubId={clubId} officers={mapped} />
        <h1 className="text-royal text-2xl font-extrabold">
          Edit club officers
        </h1>
        <EditListedOfficerForm clubId={clubId} officers={listedOfficers} />
      </div>
    </main>
  );
}
