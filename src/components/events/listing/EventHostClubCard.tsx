import Image from 'next/image';
import Link from 'next/link';
import Panel from '@src/components/common/Panel';
import { RouterOutputs } from '@src/trpc/shared';

type EventHostClubCardProps = {
  club: NonNullable<RouterOutputs['event']['getListingInfo']>['club'];
  id?: string;
};
export default function EventHostClubCard({
  club,
  id,
}: EventHostClubCardProps) {
  return (
    <Panel className="text-sm" id={id} smallPadding heading="Host Club">
      <Link
        className="flex gap-2 items-center"
        href={`/directory/${club.slug}`}
      >
        {club.profileImage && (
          <Image
            src={club.profileImage}
            alt={club.name + ' logo'}
            width={32}
            height={32}
            // flex-shrink-0 prevents the image from squishing if text is long
            className="rounded-lg w-20 md:w-32 h-auto flex-shrink-0"
          />
        )}

        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words line-clamp-2">
          {club.name}
        </p>
      </Link>
    </Panel>
  );
}
