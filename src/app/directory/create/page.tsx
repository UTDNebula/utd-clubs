import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@src/common/modules/navigation/header/Header';
import { auth } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';
import CreateClubForm from '@src/systems/clubs/CreateClubForm';

export const metadata: Metadata = {
  title: 'Create New Organization',
  description:
    'Join the 400+ orgs already on UTD Clubs to boost your recruitment and promote events to over 10K students!',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/directory/create',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/directory/create',
    description:
      'Join the 400+ orgs already on UTD Clubs to boost your recruitment and promote events to over 10K students!',
  },
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute('directory/create'));

  return (
    <>
      <Header />
      <main className="flex w-full flex-col items-center p-4">
        <div className="flex w-full max-w-4xl flex-col items-center gap-4">
          <Typography
            variant="h1"
            className="font-display text-center text-3xl font-bold"
          >
            Create New Organization
          </Typography>
          <CreateClubForm />
        </div>
      </main>
    </>
  );
}
