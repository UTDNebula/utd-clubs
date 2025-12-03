import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import Image from 'next/image';
import { type FC } from 'react';
import MarkdownText from '@src/components/MarkdownText';
import { type RouterOutputs } from '@src/trpc/shared';

const ClubInfoSegment: FC<{
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}> = async ({ club }) => {
  return (
    <div className="w-full rounded-lg bg-slate-100 p-10">
      <div className="flex flex-col items-start justify-between md:flex-row">
        <div className="pr-12">
          {club.profileImage && (
            <Image
              src={club.profileImage}
              alt={club.name + ' logo'}
              width={100}
              height={100}
              className="mb-5 rounded-lg"
            />
          )}
          <h1 className="text-2xl font-medium">Description</h1>
          {club.foundingDate && (
            <div className="mt-2 flex w-36 justify-between">
              <p className="text-sm text-slate-400">Founded</p>
              <p className="text-right text-sm text-slate-600">
                {club.foundingDate}
              </p>
            </div>
          )}
          {club.updatedAt && (
            <div className="mt-2 flex w-36 justify-between">
              <p className="text-sm text-slate-400">Updated</p>
              <p className="text-right text-sm text-slate-600">
                {format(club.updatedAt, 'LLL yyyy')}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {club.tags.map((tag) => {
              return (
                <Chip
                  label={tag}
                  key={tag}
                  className=" rounded-full font-bold transition-colors text-white"
                  color="primary"
                />
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-2/3 text-slate-700">
          <MarkdownText text={club.description} />
        </div>
        {club.officers.length != 0 && (
          <div className="w-auto max-w-[320px] min-w-0">
            <>
              <h1 className="text-center text-2xl font-medium">Leadership</h1>
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
      </div>
    </div>
  );
};

export default ClubInfoSegment;
