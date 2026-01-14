'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query'; // 1. Import this
import { useEffect } from 'react';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import ClubCard, { ClubCardSkeleton } from '../ClubCard';
import InfiniteScrollGrid from './InfiniteScrollGrid';

const ClubDirectoryGrid = () => {
  const {
    search,
    tags,
    shouldFocus,
    setShouldFocus,
    setIsFetching: setSearchBarLoading,
  } = useSearchStore((state) => state);
  const api = useTRPC();

  const { data, isFetching, isPlaceholderData } = useQuery({
    ...api.club.search.queryOptions({ search, tags, limit: 9 }),
    placeholderData: keepPreviousData, 
  });

  const showNoResults = !isFetching && data && data.clubs.length === 0;

  useEffect(() => {
    setSearchBarLoading(isFetching);
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
  }, [
    shouldFocus,
    isFetching,
    showNoResults,
    setShouldFocus,
    setSearchBarLoading,
  ]);

  return (
    <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4">
      {isFetching && !data ? (
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
        <div 
          className={`contents transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}
        >
          {data?.clubs.map((club) => (
            <ClubCard key={club.id} club={club} priority />
          ))}
          {/* Only show infinite scroll if not fetching */}
          {!isPlaceholderData && data?.clubs.length === 9 && <InfiniteScrollGrid />}
        </div>
      )}
    </div>
  );
};

export default ClubDirectoryGrid;