import Header from '@src/components/header/BaseHeader';
import type { Metadata } from 'next';

import ClubMatch from './ClubMatch';

///TODO: metadata
export const metadata: Metadata = {
  title: 'Club Match - Jupiter',
  //description: '',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/club-match',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/club-match',
    //description: '',
  },
};

const Page = () => {
  return (
    <main className="h-full">
      <Header />
      <ClubMatch />
    </main>
  );
};

export default Page;
