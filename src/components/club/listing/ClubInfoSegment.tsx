import Image from 'next/image';
import { type FC } from 'react';
import MarkdownText from '@src/components/MarkdownText';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';

const ClubInfoSegment: FC<{
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}> = async ({ club }) => {
  const isActive = await api.club.isActive({ id: club.id });
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
          <div className="mt-5 flex w-36 justify-between">
            <p className="text-sm text-slate-400">Name</p>
            <p className="text-right text-sm text-slate-600">{club.name}</p>
          </div>
          {club.foundingDate && (
            <div className="mt-2 flex w-36 justify-between">
              <p className="text-sm text-slate-400">Founded</p>
              <p className="text-right text-sm text-slate-600">
                {club.foundingDate}
              </p>
            </div>
          )}
          <div className="mt-2 flex w-36 justify-between">
            <p className="text-sm text-slate-400">Active</p>
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
