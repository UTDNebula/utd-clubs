import { TZDateMini } from '@date-fns/tz';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import Image from 'next/image';
import { BaseCard } from '@src/components/common/BaseCard';
import MarkdownText from '@src/components/MarkdownText';
import { type RouterOutputs } from '@src/trpc/shared';

const ClubInfoSegment = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  return (
    <BaseCard className="w-full bg-slate-100 p-10 flex flex-col items-start justify-between md:flex-row gap-4">
      <div className="md:max-w-1/4">
        {club.profileImage && (
          <Image
            src={club.profileImage}
            alt={club.name + ' logo'}
            width={100}
            height={100}
            className="mb-5 rounded-lg"
          />
        )}
        {club.foundingDate && (
          <div className="mt-2 flex w-36 justify-between">
            <p className="text-sm text-slate-400">Founded</p>
            <p className="text-right text-sm text-slate-600">
              {club.foundingDate.toLocaleDateString()}
            </p>
          </div>
        )}
        {club.updatedAt && (
          <div className="mt-2 flex w-36 justify-between">
            <p className="text-sm text-slate-400">Updated</p>
            <p className="text-right text-sm text-slate-600">
              {format(
                new TZDateMini(club.updatedAt, 'America/Chicago'),
                'LLL yyyy',
              )}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {club.tags.map((tag) => {
            return (
              <Chip
                label={tag}
                key={tag}
                className="font-bold"
                color="primary"
              />
            );
          })}
        </div>
      </div>
      <div className="grow text-slate-700">
        <MarkdownText text={club.description} />
      </div>
      {club.officers.length != 0 && (
        <div className="w-auto max-w-[320px] min-w-0">
          <>
            <h3 className="text-center text-2xl font-medium">Leadership</h3>
            <div className="flex flex-col justify-center align-middle">
              {club.officers.map((officer) => (
                <div className="mt-5 flex flex-row" key={officer.id}>
                  <div className="mx-5 flex flex-col justify-center align-middle">
                    <p className="text-left text-sm break-words whitespace-normal text-slate-600">
                      {officer.name}
                    </p>
                    <p className="mt-2 text-sm break-words whitespace-normal text-slate-400">
                      {officer.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        </div>
      )}
    </BaseCard>
  );
};

export default ClubInfoSegment;
