import Header from '@src/components/header/BaseHeader';
import { BlueBackButton } from '@src/components/backButton';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import { notFound, redirect } from 'next/navigation';
import { type ReactNode } from 'react';

const Layout = async ({
  params,
  children,
  events,
}: {
  params: { clubId: string };
  children: ReactNode;
  events: ReactNode;
}) => {
  const session = await getServerAuthSession();
  if (!session) redirect(signInRoute(`manage/${params.clubId}`));
  const canAccess = await api.club.isOfficer({ id: params.clubId });
  if (!canAccess) {
    return <div className="">You can&apos;t access this 😢</div>;
  }
  const club = await api.club.byId({ id: params.clubId });
  if (!club) {
    notFound();
  }
  return (
    <div className="">
      <Header />
      <main className="px-5">
        <div className="flex w-full flex-row gap-x-4 align-middle">
          <BlueBackButton />
          <h1 className="bg-gradient-to-br from-blue-primary to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent">
            {club.name}
          </h1>
        </div>
        <div className="flex w-full flex-col gap-4">
          {children}
          <div className="flex w-full flex-row gap-4 ">{events}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
