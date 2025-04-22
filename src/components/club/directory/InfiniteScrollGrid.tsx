'use client';
import { api } from '@src/trpc/react';
import { type Session } from 'next-auth';
import { useEffect, useRef } from 'react';
import ClubCard, { ClubCardSkeleton } from '../ClubCard';
import { useSearchStore } from '@src/utils/SearchStoreProvider';

type Props = {
  session: Session | null;
  tag?: string;
};

export default function InfiniteScrollGrid({ session }: Props) {
  const { search, tag } = useSearchStore((state) => state);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    api.club.all.useInfiniteQuery(
      { name: search, tag, limit: 9 },
      {
        getNextPageParam: (lastPage) =>
          lastPage.clubs.length < 9 ? undefined : lastPage.cursor,
        initialCursor: 9,
      },
    );

  const observer = useRef<IntersectionObserver>();
  const lastClubElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || isFetchingNextPage) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (!entries[0]) return;
      if (entries[0].isIntersecting) {
        void fetchNextPage();
      }
    });

    if (lastClubElementRef.current) {
      observer.current.observe(lastClubElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

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
                  <ClubCard club={club} session={session} priority={false} />
                </div>
              );
            }),
          )
        : Array.from({ length: 4 }, (_, index) => (
            <ClubCardSkeleton key={index} />
          ))}
      {isFetchingNextPage &&
        Array.from({ length: 4 }, (_, index) => (
          <ClubCardSkeleton key={index} />
        ))}
    </>
  );
}
