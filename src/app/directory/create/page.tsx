import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';
import CreateClubForm from './CreateClubForm';

export const metadata: Metadata = {
  title: 'Create New Organization',
  description:
    'Join the 400+ orgs already on UTD Clubs to increase members and advertise events!',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/directory/create',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/directory/create',
    description:
      'Join the 400+ orgs already on UTD Clubs to increase members and advertise events!',
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
