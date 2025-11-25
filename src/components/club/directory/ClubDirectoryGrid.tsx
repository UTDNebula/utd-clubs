'use client';

import { Skeleton } from '@mui/material';
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

const ClubCardSkeleton = () => {
  return (
    <div className="h-[400px] w-[320px] rounded-lg">
      <Skeleton
        variant="rectangular"
        width={320}
        height={180}
        sx={{ bgcolor: 'grey.300', borderRadius: '8px 8px 0 0' }}
      />
      <div className="p-4">
        <Skeleton
          variant="text"
          width="80%"
          height={32}
          sx={{ bgcolor: 'grey.300' }}
        />
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          sx={{ bgcolor: 'grey.300', mt: 1 }}
        />
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          sx={{ bgcolor: 'grey.300' }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          sx={{ bgcolor: 'grey.300' }}
        />
      </div>
    </div>
  );
};

const ClubDirectoryGrid: FC<Props> = ({ session }) => {
  const { search, tags } = useSearchStore((state) => state);
  const api = useTRPC();

  const { data, isFetching, isPlaceholderData } = useQuery(
    api.club.search.queryOptions(
      { search: search, tags, limit: 9 },
      {
        placeholderData: (previousData) => {
          return previousData;
        },
      },
    ),
  );

  const isLoading = isFetching || isPlaceholderData;
  const hasResults = data && data.clubs && data.clubs.length > 0;
  const showNoResults = !isLoading && data && data.clubs.length === 0;

  return (
    <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4">
      {isLoading && !hasResults ? (
        // Show skeletons only on first load (no previous data)
        <>
          {Array.from({ length: 9 }).map((_, index) => (
            <ClubCardSkeleton key={`skeleton-${index}`} />
          ))}
        </>
      ) : hasResults ? (
        <>
          {data.clubs.map((club) => (
            <ClubCard key={club.id} club={club} session={session} priority />
          ))}
          {data.clubs.length === 9 && (
            <InfiniteScrollGrid tags={tags} session={session} />
          )}
        </>
      ) : showNoResults ? (
        <div className="col-span-full text-center text-4xl font-bold text-slate-500">
          No clubs found matching your search
        </div>
      ) : null}

      {/* Only scroll to top when there are actually no results, not during loading */}
      {showNoResults && <ScrollTop />}
    </div>
  );
};

export default ClubDirectoryGrid;
