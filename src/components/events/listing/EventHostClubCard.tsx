import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Panel from '@src/nebula-library/components/Panel';
import { RouterOutputs } from '@src/trpc/shared';
import { addVersionToImage } from '@src/utils/imageCacheBust';

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
          className="flex items-center gap-2 rounded-md bg-white p-2 shadow-sm transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:shadow-md dark:hover:bg-neutral-700"
          href={`/directory/${club.slug}`}
        >
          {club.profileImage && (
            <Image
              src={addVersionToImage(
                club.profileImage,
                club.updatedAt?.getTime(),
              )}
              alt={club.name + ' logo'}
              width={32}
              height={32}
              // flex-shrink-0 prevents the image from squishing if text is long
              className="h-auto w-12 flex-shrink-0 rounded-md"
            />
          )}

          <p className="line-clamp-2 text-sm font-semibold break-words text-slate-800 dark:text-slate-200">
            {club.name}
          </p>
        </Link>
      </Tooltip>
    </Panel>
  );
}
