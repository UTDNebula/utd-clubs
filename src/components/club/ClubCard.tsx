import { type FC } from 'react';
import Image from 'next/image';
import type { SelectClub as Club } from '@src/server/db/models';
import JoinButton from './JoinButton';
import Link from 'next/link';
import { type Session } from 'next-auth';

type Props = { club: Club; session: Session | null; priority: boolean };

const ClubCard: FC<Props> = ({ club, session, priority }) => {
  const desc =
    club.description.length > 50
      ? club.description.slice(0, 150) + '...'
      : club.description;
  const name =
    club.name.length > 20 ? club.name.slice(0, 30) + '...' : club.name;
  const placeholderImage =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAQABADAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgf/xAAXEAEAAwAAAAAAAAAAAAAAAAAFACIx/8QAGAEAAgMAAAAAAAAAAAAAAAAABAUGBwj/xAAWEQADAAAAAAAAAAAAAAAAAAAAAgT/2gAMAwEAAhEDEQA/ALuYnlpkZHL4onFpieWhaOI6JySlqZaKEcnNMwtMTy0MRxFROf/Z';
  return (
    <div className="flex h-full min-h-[400px] max-w-xs min-w-[300px] flex-col justify-between rounded-lg bg-white shadow-2xl md:min-h-[600px]">
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
        <h1 className="line-clamp-1 text-2xl font-medium text-slate-800 md:text-xl">
          {name}
        </h1>
        <p className="text-sm text-slate-500 md:text-xs">Description</p>
        <p className="text-base text-slate-600 md:text-sm">{desc}</p>
      </div>
      <div className="m-5 mt-auto flex flex-row space-x-2">
        <JoinButton session={session} clubID={club.id} />
        <Link
          href={`/directory/${club.slug}`}
          className="text-blue-primary rounded-2xl bg-blue-600/10 px-4 py-2 text-xs font-extrabold transition-colors hover:bg-blue-200"
        >
          Learn More
        </Link>
      </div>
    </div>
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
