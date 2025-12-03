import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import BackButton from '@src/components/backButton';
import Header from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';

const Layout = async (props: {
  params: Promise<{ clubId: string }>;
  children: ReactNode;
  events: ReactNode;
}) => {
  const params = await props.params;

  const { children, events } = props;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute(`manage/${params.clubId}`));
  const canAccess = await api.club.isOfficer({ id: params.clubId });
  if (!canAccess) {
    return <div className="">You can&apos;t access this 😢</div>;
  }
  const club = await api.club.byId({ id: params.clubId });
  if (!club) {
    notFound();
  }
  return (
    <>
      <Header />
      <main className="px-5 flex w-full flex-col gap-4">
        <div className="flex w-full flex-row gap-x-4 items-center">
          <BackButton className="bg-royal [&>svg]:fill-white" />
          <h1 className="font-display text-2xl font-extrabold text-haiti">
            {club.name}
          </h1>
        </div>
        <div className="flex w-full flex-col gap-4">
          {children}
          <div className="flex w-full flex-row gap-4">{events}</div>
        </div>
      </main>
    </>
  );
};

export default Layout;
