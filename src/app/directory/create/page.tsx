import Header from '@src/components/header/BaseHeader';
import CreateClubForm from './createForm';
import { getServerAuthSession } from '@src/server/auth';
import { redirect } from 'next/navigation';
import { signInRoute } from '@src/utils/redirect';

export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) redirect(signInRoute('directory/create'));
  return (
    <main>
      <div className="">
        <Header />
        <CreateClubForm
          user={{
            id: session.user.id,
            name: session.user.firstName + ' ' + session.user.lastName,
          }}
        />
      </div>
    </main>
  );
}
