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
  params: Promise<{ slug: string }>;
  children: ReactNode;
}) => {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute(`manage/${slug}`));
  const club = await api.club.bySlug({ slug });
  if (!club) {
    // Backup: If using ID, redirect
    const clubSlugById = await api.club.getSlug({ id: slug });
    if (clubSlugById) {
      redirect(`/manage/${clubSlugById}`);
    }
    notFound();
  }
  const canAccess = await api.club.isOfficer({ id: club.id });
  if (!canAccess) {
    return <div className="">You can&apos;t access this 😢</div>;
  }

  return (
    <>
      <BaseHeader />
      <main className="p-4">{children}</main>
    </>
  );
};

export default Layout;
