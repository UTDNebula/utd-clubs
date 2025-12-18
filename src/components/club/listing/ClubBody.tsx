import { TZDateMini } from '@date-fns/tz';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import Image from 'next/image';
import MarkdownText from '@src/components/MarkdownText';
import { type RouterOutputs } from '@src/trpc/shared';
import ContactButton from './ContactButton';

const ClubBody = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  return (
    <section className="w-full rounded-lg p-10 flex flex-col items-start justify-between md:flex-row gap-4">
      <div className="md:w-1/5">
        <div className='flex flex-col'>
            <h2 className='text-2xl font-semibold'>Details</h2>
            {/*club.numMembers*/true && (
                <div className='flex flex-row w-full justify-between'>
                    <span>Members</span>
                    <span>67</span>
                </div>
            )}
            {/*club.foundingDate*/true && (
                <div className='flex flex-row w-full justify-between'>
                    <span>Founded</span>
                    <span>May 2020</span>
                </div>
            )}
            {/*club.*/true && (
                <div className='flex flex-row w-full justify-between'>
                    <span>Last Active</span>
                    <span>2020 present</span>
                </div>
            )}
            {/*club.updatedAt*/true && (
                <div className='flex flex-row w-full justify-between'>
                    <span>Updated</span>
                    <span>Nov 2025</span>
                </div>
            )}
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
    </section>
  );
};

export default ClubBody;
