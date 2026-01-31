'use client';

import dynamic from 'next/dynamic';

const HomePageSearchBar = dynamic(
  () =>
    import('./HomePageSearch').then((mod) => mod.HomePageSearchBar),
  { ssr: false },
);

export default function HomePageSearchClient() {
  return <HomePageSearchBar />;
}
