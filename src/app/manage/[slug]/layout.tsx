import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import Header from '@/lib/modules/navigation/header';
import { signInRoute } from '@/lib/utils/redirect';
import { auth } from '@/server/auth';
import { api } from '@/trpc/server';

const Layout = async ({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}) => {
  const [{ slug }, session] = await Promise.all([
    params,
    auth.api.getSession({ headers: await headers() }),
  ]);
  if (!session) redirect(await signInRoute(`manage/${slug}`));

  const club = await api.club.bySlug({ slug });
  if (!club) {
    // Backup: If using ID, redirect
    const clubSlugById = await api.club.getSlug({ clubId: slug });
    if (clubSlugById) {
      redirect(`/manage/${clubSlugById}`);
    }
    notFound();
  }

  const canAccess = await api.user.clubs.isOfficer({ clubId: club.id });
  if (!canAccess) {
    return <div className="">You can&apos;t access this 😢</div>;
  }

  return (
    <>
      <Header itemVisibility={{ search: false }} />
      <main className="p-4">{children}</main>
    </>
  );
};

export default Layout;
