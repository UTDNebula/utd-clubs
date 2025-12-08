import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';
import CreateClubForm from './CreateClubForm';

export const metadata: Metadata = {
  title: 'Create New Organization',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/directory/create',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/directory/create',
  },
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute('directory/create'));

  return (
    <>
      <Header />
      <main className="p-4 flex w-full flex-col items-center">
        <CreateClubForm />
      </main>
    </>
  );
}
