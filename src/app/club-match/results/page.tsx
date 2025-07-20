import { getServerAuthSession } from '@src/server/auth';
import { redirect } from 'next/navigation';
import { signInRoute } from '@src/utils/redirect';

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
  if (!user) return null;
  ///TODO: get resilts from profile
  ///TODO: if no results, redirect to club-match

  return (
    <main className="h-full">
      <Header />
      {/*data.map((club) => (
        <div key={club.id}>
          <a
            href={'https://jupiter.utdnebula.com/directory/' + club.id}
          >
            {club.name}
          </a>
          <p>{club.reasoning}</p>
          <ul>
            {club.benefit.split(', ').map((benefit) => (
              <li>{benefit}</li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={() => {
          //TODO: clear user metadata for club match
        }}
      >
        Redo club match
      </button>*/}
    </main>
  );
};

export default Page;
