'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { RouterOutputs } from '@/trpc/shared';
import ClubCard, { ClubCardSkeleton } from '../ClubCard';
import InfiniteScrollGrid from './InfiniteScrollGrid';

export type Cards = (
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

type ClubGridProps = {
  cards: Cards | undefined;
  isLoading: boolean;
  showNoResults: boolean;
  showInfiniteScroll: boolean;
};

export const ClubGrid = ({
  cards,
  isLoading,
  showNoResults,
  showInfiniteScroll,
}: ClubGridProps) => {
  return (
    <div
      className={`grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4 transition-opacity duration-300 ${!showNoResults && 'pb-40'}`}
    >
      {isLoading ? (
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
          {showInfiniteScroll && <InfiniteScrollGrid />}
        </AnimatePresence>
      )}
    </div>
  );
};
