import { TZDateMini } from '@date-fns/tz';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import Image from 'next/image';
import MarkdownText from '@src/components/MarkdownText';
import { type RouterOutputs } from '@src/trpc/shared';
import ContactButton from './ContactButton';
import ClubOfficer from './ClubOfficer';
import { api } from '@src/trpc/server';
import EventCard from '@src/components/events/EventCard';
import ExpandableMarkdownText from '@src/components/ExpandableMarkdownText';

const ClubBody = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
    const events = await api.event.byClubId({
        clubId: club.id,
        sortByDate: true,
        // currentTime: new Date(),
    });
  return (
    <section className="w-full rounded-lg p-10 flex flex-col items-start md:flex-row gap-4">
      <div className="flex flex-col md:w-1/5 flex-shrink-0">
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
        <div className='flex flex-col'>
            <h2 className='text-2xl font-semibold'>Contact</h2>
            {club.contacts && club.contacts.map((contact) => <ContactButton key={contact.platform} contact={contact} />)}
        </div>
        <div className='flex flex-col'>
            <h2 className='text-2xl font-semibold'>Officers</h2>
            {club.officers.length != 0 && (
            <div className="w-auto max-w-[320px] min-w-0">
            <>
                <div className="flex flex-col justify-center align-middle">
                {club.officers.map((officer) => (
                    <ClubOfficer key={officer.name} officer={officer}/>
                ))}
                </div>
            </>
            </div>
        )}
        </div>
      </div>
      <div className='flex flex-col md:w-4/5'>
        <div className="grow text-slate-700">
            <ExpandableMarkdownText text={club.description} />
        </div>
        {events.length > 0 && (
            <div className='flex flex-row overflow-x-auto gap-4'>
                {events.map((event) => (
                    <div className='flex-shrink-0'>
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        )}
    </div>
    </section>
  );
};

export default ClubBody;
