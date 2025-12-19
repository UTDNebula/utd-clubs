import EventCard from '@src/components/events/EventCard';
import ExpandableMarkdownText from '@src/components/ExpandableMarkdownText';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';
import ClubOfficer from './ClubOfficer';
import ContactButton from './ContactButton';
import OfficerList from './OfficerList';

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
        <section className="w-full rounded-lg p-10 grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
            <div className="md:col-span-1 flex flex-col gap-4 h-full">
                <div className="flex flex-col bg-slate-100 p-4 rounded-xl gap-2 text-sm">
                    <h2 className="text-2xl font-semibold mb-2">Details</h2>
                    {
                /*club.numMembers*/ true && (
                            <div className="flex flex-row w-full justify-between">
                                <span>Members</span>
                                <span>67</span>
                            </div>
                        )
                    }
                    {
                /*club.foundingDate*/ true && (
                            <div className="flex flex-row w-full justify-between">
                                <span>Founded</span>
                                <span>May 2020</span>
                            </div>
                        )
                    }
                    {
                /*club.*/ true && (
                            <div className="flex flex-row w-full justify-between">
                                <span>Last Active</span>
                                <span>2020 present</span>
                            </div>
                        )
                    }
                    {
                /*club.updatedAt*/ true && (
                            <div className="flex flex-row w-full justify-between">
                                <span>Updated</span>
                                <span>Nov 2025</span>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col bg-slate-100 p-4 rounded-xl gap-2">
                    <h2 className="text-2xl font-semibold mb-2">Contact</h2>
                    {club.contacts &&
                        club.contacts.map((contact) => (
                            <div key={contact.platform} className='bg-white rounded-4xl'><ContactButton contact={contact} /></div>
                        ))}
                </div>
                <OfficerList officers={club.officers} /> 
            </div>
            <div id="club-content-right" className="md:col-span-4 flex flex-col">
                <div className="grow text-slate-700">
                    <ExpandableMarkdownText text={club.description} />
                </div>
                <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
                    {events.length > 0 ? (
                        events.map((event) => <EventCard key={event.id} event={event} />)
                    ) : (
                        <div className="text-md font-medium text-gray-700">
                            There are no upcoming events.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ClubBody;
