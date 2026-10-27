'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSearchStore } from '@/systems/dashboard/SearchStoreProvider';
import { useTRPC } from '@/trpc/react';
import ClubMatchAdCard, {
  ClubMatchAdDismissedOnStorageKey,
} from './ads/ClubMatchAdCard';
import { Cards, ClubGrid } from './ClubGrid';

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

  const showNoResults = !isFetching && !!data && data.clubs.length === 0;

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
    <ClubGrid
      cards={cards}
      isLoading={isFetching && !data}
      showNoResults={showNoResults}
      showInfiniteScroll={!isPlaceholderData && data?.clubs.length === 9}
    />
  );
};

export default ClubDirectoryGrid;
