import EventCard from '@src/components/events/EventCard';
import ExpandableMarkdownText from '@src/components/ExpandableMarkdownText';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';
import ContactButton from './ContactButton';
import OfficerList from './OfficerList';

const ClubBody = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const events = await api.event.byClubId({
    clubId: club.id,
    sortByDate: true,
    // currentTime: now,
  });
  const upcomingEvents = events.filter((e) => e.endTime >= now);
  const lastEventDate =
    events.filter((e) => e.startTime <= now).reverse()[0]?.endTime ?? null;
  return (
    <section className="w-full rounded-lg grid grid-cols-1 md:grid-cols-5 gap-5 items-start mt-8">
      <div className="md:col-span-1 flex flex-col gap-4 h-full">
        <div className="flex flex-col bg-neutral-50 border-slate-200 shadow-sm  p-5 rounded-xl gap-2 text-sm text-slate-600">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Details</h2>
          {club.numMembers ||
          club.foundingDate ||
          lastEventDate ||
          club.updatedAt ? ( //TODO: must remove the true's
            <>
              {club.numMembers && (
                <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="font-medium text-slate-500">Members</span>
                  <span className="text-slate-500">{club.numMembers}</span>
                </div>
              )}
              {club.foundingDate && (
                <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="font-medium text-slate-500">Founded</span>
                  <span className="text-slate-50club0">
                    {club.foundingDate.toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {lastEventDate && true && (
                <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="font-medium text-slate-500">
                    Last Active
                  </span>
                  <span className="text-slate-500">
                    {lastEventDate.toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {
                /*club.updatedAt*/ true && (
                  <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="font-medium text-slate-500">Updated</span>
                    <span className="text-slate-500">Nov 2025</span>
                  </div>
                )
              }
            </>
          ) : (
            <span className="text-slate-500">No details</span>
          )}
        </div>
        <div className="flex flex-col bg-neutral-50 border-slate-200 shadow-sm  p-5 rounded-xl gap-2">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Contact</h2>
          {club.contacts && club.contacts.length > 0 ? (
            club.contacts.map((contact) => (
              <div
                key={contact.platform}
                className="bg-white shadow-sm rounded-4xl hover:bg-gray-100 transition-colors duration-200"
              >
                <ContactButton contact={contact} />
              </div>
            ))
          ) : (
            <span className="text-slate-500 text-sm">No contact info</span>
          )}
        </div>
        <OfficerList officers={club.officers} />
      </div>
      <div
        id="club-content-right"
        className="md:col-span-4 flex flex-col gap-4"
      >
        <div className="bg-neutral-50 border-slate-200 shadow-sm p-10 rounded-xl grow text-slate-700">
          <ExpandableMarkdownText
            text={
              club.description.length > 0
                ? club.description
                : '**Check us out!**'
            }
            maxLines={10}
          />
        </div>
        <div className="flex flex-col bg-neutral-50 border-slate-200 shadow-sm  p-5 rounded-xl">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Upcoming Events
          </h2>
          <div className="flex flex-wrap w-full justify-evenly items-center gap-4 mt-5">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-md font-medium text-gray-700">
                {club.updatedAt == null || club.updatedAt < oneYearAgo
                  ? 'No info about upcoming events'
                  : 'There are no upcoming events'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubBody;
