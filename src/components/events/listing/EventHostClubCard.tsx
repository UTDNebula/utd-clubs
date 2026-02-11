import { Tooltip } from '@mui/material';
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
      <Tooltip title="View club directory page" disableInteractive>
        <Link
          className="flex gap-2 items-center p-2 rounded-md bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-sm dark:shadow-md"
          href={`/directory/${club.slug}`}
        >
          {club.profileImage && (
            <Image
              src={`${club.profileImage}?v=${club.updatedAt?.getTime()}`}
              alt={club.name + ' logo'}
              width={32}
              height={32}
              // flex-shrink-0 prevents the image from squishing if text is long
              className="rounded-md w-12 h-auto flex-shrink-0"
            />
          )}

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words line-clamp-2">
            {club.name}
          </p>
        </Link>
      </Tooltip>
    </Panel>
  );
}
