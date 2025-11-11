import { redirect } from 'next/navigation';
import BackButton from '@src/components/backButton';
import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import EditListedOfficerForm from './EditListedOfficerForm';
import EditOfficerForm from './EditOfficerForm';

export default async function Page({
  params: { clubId },
}: {
  params: { clubId: string };
}) {
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
        <BackButton />
        <h1 className="text-blue-primary text-2xl font-extrabold">
          Edit club Collaborators
        </h1>
        <EditOfficerForm clubId={clubId} officers={mapped} />
        <h1 className="text-blue-primary text-2xl font-extrabold">
          Edit club officers
        </h1>
        <EditListedOfficerForm clubId={clubId} officers={listedOfficers} />
      </div>
    </main>
  );
}
