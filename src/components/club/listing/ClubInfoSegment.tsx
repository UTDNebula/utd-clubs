import Image from 'next/image';
import { type FC } from 'react';
import { type RouterOutputs } from '@src/trpc/shared';
import { api } from '@src/trpc/server';

const ClubInfoSegment: FC<{
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}> = async ({ club }) => {
  const isActive = await api.club.isActive({ id: club.id });
  return (
    <div className="w-full rounded-lg bg-slate-100 p-10">
      <div className="flex flex-col items-start justify-between md:flex-row">
        <div className="pr-12">
          <Image
            src={club.profileImage ? club.profileImage : club.image}
            alt="Picture of the club"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <h1 className="mt-5 text-2xl font-medium">Description</h1>
          <div className="mt-5 flex w-36 justify-between">
            <p className="text-sm text-slate-400">Name</p>
            <p className="text-right text-sm text-slate-600">{club.name}</p>
          </div>
          <div className="mt-2 flex w-36 justify-between">
            <p className="text-sm text-slate-400">Founded</p>
            <p className="text-right text-sm text-slate-600">May 2020</p>
          </div>
          <div className="mt-2 flex w-36 justify-between">
            <p className="text-sm text-slate-400">Active</p>
            <p className="text-right text-sm text-slate-600">
              {isActive ? 'Present' : 'Inactive'}
            </p>
          </div>
        </div>
        <div className="w-full">
          <p className="whitespace-pre-wrap text-slate-700">
            {club.description}
          </p>
        </div>
        {club.officers.length != 0 && (
          <div className="min-w-fit">
            <>
              <h1 className="text-center text-2xl font-medium">Leadership</h1>
              <div className="flex flex-col justify-center align-middle">
                {club.officers.map((officer) => (
                  <div className="mt-5 flex flex-row" key={officer.id}>
                    <Image
                      src={club.image}
                      alt="Picture of the author"
                      width={60}
                      height={60}
                      className="m-3 rounded-full"
                    />
                    <div className="mx-5 flex flex-col justify-center align-middle">
                      <p className="text-left text-sm text-slate-600">
                        {officer.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
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
