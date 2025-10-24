import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';
import { redirect } from 'next/navigation';

import CreateClubForm from './createForm';

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
