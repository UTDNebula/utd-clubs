import { getServerAuthSession } from '@src/server/auth';
import { redirect } from 'next/navigation';
import { signInRoute } from '@src/utils/redirect';
import { db } from '@src/server/db';
import { eq } from 'drizzle-orm';

import Header from '@src/components/header/BaseHeader';
import type { Metadata } from 'next';

///TODO: metadata
export const metadata: Metadata = {
  title: 'Club Match Results - Jupiter',
  //description: '',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/club-match/results',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/club-match/results',
    //description: '',
  },
};

const Page = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(signInRoute('club-match'));
  }

  const user = session.user;

  const data = (
    await db.query.userAiCache.findFirst({
      where: (userAiCache) => eq(userAiCache.id, user.id),
    })
  )?.clubMatch;

  if (data == null) {
    redirect('/club-match');
  }

  return (
    <main className="h-full">
      <Header />
      <a href="/club-match">Redo club match</a>
      {data.map((club) => (
        <div key={club.id}>
          <a href={'https://jupiter.utdnebula.com/directory/' + club.id}>
            {club.name}
          </a>
          <p>{club.reasoning}</p>
          <ul>
            {club.benefit.split(', ').map((benefit) => (
              <li key={benefit}>
                {benefit.charAt(0).toUpperCase() + benefit.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
};

export default Page;
