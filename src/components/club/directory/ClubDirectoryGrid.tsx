'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import ClubCard, { ClubCardSkeleton } from '../ClubCard';
import InfiniteScrollGrid from './InfiniteScrollGrid';

const ClubDirectoryGrid = () => {
  const { search, tags, shouldFocus, setShouldFocus } = useSearchStore(
    (state) => state,
  );
  const api = useTRPC();

  const { data, isFetching } = useQuery(
    api.club.search.queryOptions({ search, tags, limit: 9 }),
  );

  const showNoResults = !isFetching && data && data.clubs.length === 0;

  useEffect(() => {
    // Focus on the first club card after the user hits Enter and the results load
    if (shouldFocus && !isFetching && !showNoResults) {
      setShouldFocus(false);
      const firstClubCard = document.querySelector('[data-club-result]');
      if (firstClubCard instanceof HTMLElement) {
        firstClubCard.focus({
          preventScroll: true,
        });
      }
    }
  }, [shouldFocus, isFetching, showNoResults, setShouldFocus]);

  return (
    <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4">
      {isFetching ? (
        <>
          {Array.from({ length: 9 }).map((_, index) => (
            <ClubCardSkeleton key={`skeleton-${index}`} />
          ))}
        </>
      ) : showNoResults ? (
        <div className="mt-32 mb-24 col-span-full text-center text-4xl font-bold text-slate-500">
          No clubs found matching your search
        </div>
      ) : (
        <>
          {data?.clubs.map((club) => (
            <ClubCard key={club.id} club={club} priority />
          ))}
          {data?.clubs.length === 9 && <InfiniteScrollGrid />}
        </>
      )}
    </div>
  );
};

export default ClubDirectoryGrid;
