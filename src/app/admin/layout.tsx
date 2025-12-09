import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';
import { BaseHeader } from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) notFound();
  const userId = session.user.id;
  const isAdmin = await db.query.admin.findFirst({
    where: (admin) => eq(admin.userId, userId),
  });
  if (!isAdmin) {
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
