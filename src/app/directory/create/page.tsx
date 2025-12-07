import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';
import CreateClubForm from './createForm';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute('directory/create'));
  return (
    <>
      <Header />
      <main className="p-4">
        <CreateClubForm
          user={{
            id: session.user.id,
            name: session.user.name,
          }}
        />
      </main>
    </>
  );
}
