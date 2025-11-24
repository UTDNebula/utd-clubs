import { type Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import type { SelectClub as Club } from '@src/server/db/models';
import JoinButton from './JoinButton';

type Props = { club: Club; session: Session | null; priority: boolean };

const ClubCard: FC<Props> = ({ club, session, priority }) => {
  const desc =
    club.description.length > 50
      ? club.description.slice(0, 150) + '...'
      : club.description;
  const name = club?.name ?? '';

  return (
    <Link href={`/directory/${club.slug}`} className="block group">
      <div className="flex h-full min-h-[400px] max-w-xs min-w-[300px] flex-col justify-between rounded-lg bg-white shadow-2xl md:min-h-[600px]">
        <div className="relative h-48 overflow-hidden rounded-t-lg sm:h-56 md:h-64 lg:h-72">
          {club.profileImage && (
            <Image
              src={club.profileImage}
              fill
              alt={club.name + ' logo'}
              priority={priority}
              sizes="20rem"
              className="object-cover select-none z-10"
            />
          )}
          <div className="absolute inset-0 h-full w-full bg-gray-200" />
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
      </div>
    </Link>
  );
};

export const ClubCardSkeleton: FC = () => {
  return (
    <div className="flex h-full min-h-[600px] min-w-[300px] animate-pulse flex-col rounded-lg bg-white shadow-lg">
      <div className="h-48 bg-slate-300 sm:h-56 md:h-64 lg:h-72"></div>
      <div className="space-y-4 p-6">
        <div className="h-6 rounded-sm bg-slate-300"></div>
        <div className="h-4 rounded-sm bg-slate-300"></div>
        <div className="h-4 w-3/4 rounded-sm bg-slate-300"></div>
        <div className="h-4 w-1/2 rounded-sm bg-slate-300"></div>
      </div>
    </div>
  );
};

export default ClubCard;
