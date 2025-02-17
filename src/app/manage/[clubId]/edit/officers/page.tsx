import Header from '@src/components/header/BaseHeader';
import { BlueBackButton } from '@src/components/backButton';
import EditOfficerForm from './EditOfficerForm';
import { api } from '@src/trpc/server';
import { getServerAuthSession } from '@src/server/auth';
import { redirect } from 'next/navigation';
import { signInRoute } from '@src/utils/redirect';
import EditListedOfficerForm from './EditListedOfficerForm';

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
    <main className="h-full md:pl-72">
      <Header />
      <div className="flex flex-col gap-y-2 px-5">
        <BlueBackButton />
        <h1 className="text-2xl font-extrabold text-blue-primary">
          Edit club Collaborators
        </h1>
        <EditOfficerForm clubId={clubId} officers={mapped} />
        <h1 className="text-2xl font-extrabold text-blue-primary">
          Edit club officers
        </h1>
        <EditListedOfficerForm clubId={clubId} officers={listedOfficers} />
      </div>
    </main>
  );
}
