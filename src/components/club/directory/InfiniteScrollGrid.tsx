'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import ClubCard, { ClubCardSkeleton } from '../ClubCard';

export default function InfiniteScrollGrid() {
  const { search, tags } = useSearchStore((state) => state);
  const api = useTRPC();
  const { data, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      api.club.search.infiniteQueryOptions(
        { search, tags: tags, limit: 9 },
        {
          getNextPageParam: (lastPage) =>
            lastPage.clubs.length < 9 ? undefined : lastPage.cursor,
          initialCursor: 9,
        },
      ),
    );

  const observer = useRef<IntersectionObserver>(undefined);
  const lastClubElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (observer.current == undefined) {
      observer.current = new IntersectionObserver((entries) => {
        if (!entries[0]) return;
        if (entries[0].isIntersecting) {
          void fetchNextPage();
        }
      });
    }

    if (lastClubElementRef.current) {
      observer.current.observe(lastClubElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [fetchNextPage, data]);

  return (
    <>
      {data && !isLoading
        ? data.pages.map((page, index) =>
            page.clubs.map((club, clubIndex) => {
              const isLastElement =
                index === data.pages.length - 1 &&
                clubIndex === page.clubs.length - 1;
              return (
                <div
                  ref={isLastElement ? lastClubElementRef : null}
                  key={club.id}
                >
                  <ClubCard club={club} priority={false} />
                </div>
              );
            }),
          )
        : Array.from({ length: 6 }, (_, index) => (
            <ClubCardSkeleton key={index} />
          ))}
      {isFetchingNextPage &&
        Array.from({ length: 3 }, (_, index) => (
          <ClubCardSkeleton key={index} />
        ))}
    </>
  );
}
