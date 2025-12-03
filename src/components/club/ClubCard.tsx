'use client';

import { Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import type { SelectClub as Club } from '@src/server/db/models';
import { authClient } from '@src/utils/auth-client';
import JoinButton, { JoinButtonSkeleton } from './JoinButton';

type Props = { club: Club; priority: boolean };

const ClubCard: FC<Props> = ({ club, priority }) => {
  const { data: session } = authClient.useSession();
  const desc =
    club.description.length > 50
      ? club.description.slice(0, 150) + '...'
      : club.description;
  const name = club?.name ?? '';
  const placeholderImage =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAQABADAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgf/xAAXEAEAAwAAAAAAAAAAAAAAAAAFACIx/8QAGAEAAgMAAAAAAAAAAAAAAAAABAUGBwj/xAAWEQADAAAAAAAAAAAAAAAAAAAAAgT/2gAMAwEAAhEDEQA/ALuYnlpkZHL4onFpieWhaOI6JySlqZaKEcnNMwtMTy0MRxFROf/Z';

  return (
    <Link
      href={`/directory/${club.slug}`}
      className="flex h-full min-h-[400px] max-w-xs min-w-[300px] flex-col justify-between rounded-lg bg-white shadow-2xl md:min-h-[600px]"
      data-club-result
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg sm:h-56 md:h-64 lg:h-72">
        {club.profileImage ? (
          <Image
            src={club.profileImage}
            fill
            alt={club.name + ' logo'}
            priority={priority}
            sizes="20rem"
            className="object-cover select-none"
            placeholder="blur"
            blurDataURL={placeholderImage}
          />
        ) : (
          <div className="absolute inset-0 h-full w-full bg-gray-200" />
        )}
      </div>

      <div className="flex flex-col space-y-2 p-6">
        <h1 className="line-clamp-2 text-2xl font-medium text-slate-800 md:text-xl">
          {name}
        </h1>
        <p className="text-base text-slate-600 md:text-sm">{desc}</p>
      </div>

      <div className="m-5 mt-auto flex flex-row space-x-2">
        <JoinButton session={session} clubID={club.id} />
      </div>
    </Link>
  );
};

export const ClubCardSkeleton = () => {
  return (
    <div className="flex h-full min-h-[400px] max-w-xs min-w-[300px] flex-col justify-between rounded-lg bg-white shadow-2xl md:min-h-[600px]">
      <div className="relative h-48 overflow-hidden rounded-t-lg sm:h-56 md:h-64 lg:h-72">
        <Skeleton
          variant="rectangular"
          className="absolute inset-0 h-full w-full bg-gray-200"
        />
      </div>
      <div className="flex flex-col space-y-2 p-6">
        <Skeleton variant="text" className="text-2xl font-medium md:text-xl" />
        <Skeleton
          variant="text"
          className="text-2xl font-medium md:text-xl w-1/2"
        />
        <Skeleton variant="text" className="text-base md:text-sm" />
        <Skeleton variant="text" className="text-base md:text-sm" />
        <Skeleton variant="text" className="text-base md:text-sm" />
        <Skeleton variant="text" className="text-base md:text-sm w-1/4" />
      </div>
      <div className="m-5 mt-auto flex flex-row space-x-2">
        <JoinButtonSkeleton />
      </div>
    </div>
  );
};

export default ClubCard;
