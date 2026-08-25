'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { useSearchStore } from '@/systems/dashboard/SearchStoreProvider';
import { useTRPC } from '@/trpc/react';
import ClubCard, { ClubCardSkeleton } from '../ClubCard';
import InfiniteScrollGrid from './InfiniteScrollGrid';
import ClubMatchAdCard, {
  ClubMatchAdDismissedOnStorageKey,
} from './ads/ClubMatchAdCard';
import { RouterOutputs } from '@/trpc/shared';
import { subDays } from 'date-fns';

type Cards = (
  | {
      type: 'club';
      club: RouterOutputs['club']['search']['clubs'][number];
    }
  | {
      type: 'ad';
      key: string;
      render: ReactNode;
    }
)[];

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

  // Club match ad stays dismissed for up to 7 days
  const [dismissedClubMatchAd, setDismissedClubMatchAd] = useState<boolean>(
    () => {
      let storageValue: string | null = null;
      if (typeof window !== 'undefined') {
        storageValue = window.localStorage.getItem(
          ClubMatchAdDismissedOnStorageKey,
        );
      }

      if (!storageValue) return false;
      const storageDate = new Date(storageValue);
      const oneWeekAgo = subDays(new Date(), 7);
      return storageDate.getTime() > oneWeekAgo.getTime();
    },
  );

  // Don't show club match ad if user has done club match
  const { data: didClubMatch } = useQuery(
    api.user.metadata.didClubMatch.queryOptions(),
  );
  if (didClubMatch && !dismissedClubMatchAd) setDismissedClubMatchAd?.(true);

  const cards: Cards | undefined = data?.clubs.map((club) => ({
    type: 'club',
    club: club,
  }));

  if (cards && !dismissedClubMatchAd) {
    const placeAtEnd = search !== '' || tags.length !== 0;
    cards.splice(placeAtEnd ? cards.length : 1, 0, {
      type: 'ad',
      key: 'club-match-ad',
      render: <ClubMatchAdCard setDismissed={setDismissedClubMatchAd} />,
    });
  }

  return (
    <div
      className={`grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4 transition-opacity duration-300 ${!showNoResults && 'pb-40'}`}
    >
      {isFetching && !data ? (
        <>
          {Array.from({ length: 9 }).map((_, index) => (
            <ClubCardSkeleton key={`skeleton-${index}`} />
          ))}
        </>
      ) : showNoResults ? (
        <div className="col-span-full mt-32 mb-24 text-center text-4xl font-bold text-slate-600 dark:text-slate-400">
          No clubs found matching your search
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {cards?.map((card) => (
            <motion.div
              key={card.type === 'club' ? card.club.id : card.key}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                layout: { type: 'spring', stiffness: 120, damping: 20 },
                opacity: { duration: 0.3 },
              }}
              className="h-full w-full"
            >
              {card.type === 'club' ? (
                <ClubCard club={card.club} priority />
              ) : (
                card.render
              )}
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
