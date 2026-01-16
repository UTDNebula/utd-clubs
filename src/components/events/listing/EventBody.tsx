import { TZDateMini } from '@date-fns/tz';
import ClubContactCard from '@src/components/club/listing/ClubContactCard';
import ClubUpcomingEventsCard from '@src/components/club/listing/ClubUpcomingEventsCard';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';
import EventDescriptionCard from './EventDescriptionCard';
import EventDetailsCard from './EventDetailsCard';
import EventHostClubCard from './EventHostClubCard';

const EventBody = async ({
  event,
}: {
  event: NonNullable<RouterOutputs['event']['getListingInfo']>;
}) => {
  const now = TZDateMini.tz('America/Chicago');

  const events = (
    await api.event.clubUpcoming({
      clubId: event.club.id,
      currentTime: now,
    })
  ).filter((e) => e.id !== event.id);

  return (
    <section
      id="event-body"
      className="w-full rounded-lg grid grid-cols-1 md:grid-cols-[256px_1fr] gap-4 items-start"
    >
      <div
        id="club-content-left"
        className="flex flex-col gap-4 h-full order-2 md:order-1"
      >
        <EventHostClubCard id="host" club={event.club} />
        <EventDetailsCard id="details" event={event} />
        <ClubContactCard id="contact" club={event.club} />
      </div>
      <div
        id="club-content-right"
        className="flex flex-col gap-4 order-1 md:order-2"
      >
        <EventDescriptionCard id="description" event={event} />
        <ClubUpcomingEventsCard
          id="upcoming-events"
          heading="Other Events"
          upcomingEvents={events}
          emptyText="No other events"
        />
      </div>
    </section>
  );
};

export default EventBody;
