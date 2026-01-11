'use client';

import { Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { BaseCard } from '@src/components/common/BaseCard';
import type { SelectClub as Club } from '@src/server/db/models';
import JoinButton, { JoinButtonSkeleton } from './JoinButton';

type Props = { club: Club; priority?: boolean; manageView?: boolean };

const ClubCard = ({ club, priority = false, manageView = false }: Props) => {
  const desc = club.description;
  const name = club.name;

  return (
    <BaseCard
      variant="interactive"
      className="flex h-full min-h-[400px] max-w-xs min-w-[300px] flex-col md:min-h-[600px]"
      data-club-result
    >
      <Link
        href={manageView ? `/manage/${club.slug}` : `/directory/${club.slug}`}
        className="grow flex flex-col"
      >
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 h-full w-full bg-white dark:bg-neutral-900" />
          {club.profileImage && (
            <Image
              src={club.profileImage}
              fill
              alt={club.name + ' logo'}
              priority={priority}
              sizes="20rem"
              className="object-contain select-none"
            />
          )}
        </div>

        <div className="flex flex-col space-y-2 p-6">
          <p className="line-clamp-2 text-xl font-medium text-slate-800 dark:text-slate-200">
            {name}
          </p>
          <p className="line-clamp-9 text-base text-slate-600 dark:text-slate-400">
            {desc}
          </p>
        </div>
      </Link>

      <div className="m-5 mt-0 flex flex-row space-x-2">
        <JoinButton clubId={club.id} clubSlug={club.slug} />
      </div>
    </BaseCard>
  );
};

export const ClubCardSkeleton = () => {
  return (
    <BaseCard
      variant="interactive"
      className="flex h-full min-h-[400px] max-w-xs min-w-[300px] flex-col justify-between md:min-h-[600px]"
    >
      <div className="grow flex flex-col">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Skeleton
            variant="rectangular"
            className="absolute inset-0 h-full w-full bg-slate-200 dark:bg-slate-800"
          />
        </div>
        <div className="flex flex-col space-y-2 p-6">
          <Skeleton variant="text" className="text-xl font-medium" />
          <Skeleton variant="text" className="text-xl font-medium w-1/2" />
          <Skeleton variant="text" className="text-base" />
          <Skeleton variant="text" className="text-base" />
          <Skeleton variant="text" className="text-base" />
          <Skeleton variant="text" className="text-base w-1/4" />
        </div>
      </div>
      <div className="m-5 mt-0 flex flex-row space-x-2">
        <JoinButtonSkeleton />
      </div>
    </BaseCard>
  );
};

export default ClubCard;
