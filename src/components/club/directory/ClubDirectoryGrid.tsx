'use client';

import { useQuery } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { type FC } from 'react';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import ClubCard from '../ClubCard';
import InfiniteScrollGrid from './InfiniteScrollGrid';
import ScrollTop from './ScrollTop';

interface Props {
  session: Session | null;
}

const ClubDirectoryGrid: FC<Props> = ({ session }) => {
  const { search, tag } = useSearchStore((state) => state);
  const api = useTRPC();
  const { data } = useQuery(
    api.club.all.queryOptions({ name: search, tag, limit: 9 }),
  );

  return (
    <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4">
      {data &&
        data.clubs.map((club) => (
          <ClubCard key={club.id} club={club} session={session} priority />
        ))}
      {data && data.clubs.length === 9 && (
        <InfiniteScrollGrid tag={tag} session={session} />
      )}
      <ScrollTop />
    </div>
  );
};

export default ClubDirectoryGrid;
