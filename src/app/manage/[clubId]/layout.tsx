import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { BaseHeader } from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';

const Layout = async ({
  params,
  children,
}: {
  params: Promise<{ clubId: string }>;
  children: ReactNode;
}) => {
  const { clubId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute(`manage/${clubId}`));
  const canAccess = await api.club.isOfficer({ id: clubId });
  if (!canAccess) {
    return <div className="">You can&apos;t access this 😢</div>;
  }
  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }

  return (
    <>
      <BaseHeader />
      <main className="p-4">{children}</main>
    </>
  );
};

export default Layout;
