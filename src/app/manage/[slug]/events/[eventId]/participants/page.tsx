import { notFound } from 'next/navigation';
import ManageHeader from '@src/components/manage/ManageHeader';
import UserList from './UserList';
import { api } from '@src/trpc/server';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const club = await api.club.bySlug({ slug });
  if (!club) {
    notFound();
  }

  const members = await api.club.getMembers({ id: club.id });

  return (
    <main>
      <ManageHeader
        club={club}
        path={[{ text: 'Followers', href: `/manage/${slug}/followers` }]}
        hrefBack={`/manage/${slug}/`}
      />
      <div className="flex w-full flex-col items-center">
        <UserList members={members} club={club} />
      </div>
    </main>
  );
}
