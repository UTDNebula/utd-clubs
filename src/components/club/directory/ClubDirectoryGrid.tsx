'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
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
    if (shouldFocus && !isFetching && !showNoResults) {
      setShouldFocus(false);
      const firstClubCard = document.querySelector('[data-club-result]');
      if (firstClubCard instanceof HTMLElement) {
        firstClubCard.focus({ preventScroll: true });
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
    <div
      className={`grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4 transition-opacity duration-300`}
    >
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
        <AnimatePresence mode="popLayout">
          {data?.clubs.map((club) => (
            <motion.div
              key={club.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                layout: { type: 'spring', stiffness: 120, damping: 20 },
                opacity: { duration: 0.3 },
              }}
              className="h-full w-full"
            >
              <ClubCard club={club} priority />
            </motion.div>
          ))}
          {/* Only show infinite scroll if not fetching */}
          {!isPlaceholderData && data?.clubs.length === 9 && (
            <InfiniteScrollGrid />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ClubDirectoryGrid;
