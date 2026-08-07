import { TZDateMini } from '@date-fns/tz';
import ClubContactCard from '@src/features/clubs/listing/ClubContactCard';
import ClubUpcomingEventsCard from '@src/features/clubs/listing/ClubUpcomingEventsCard';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';
import EventCountdownCard from './EventCountdownCard';
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

  const clubUpcomingEventsCard = (
    <ClubUpcomingEventsCard
      id="upcoming-events"
      heading="Other Events From This Club"
      upcomingEvents={events}
      emptyText="No other events"
    />
  );

  return (
    <section
      id="event-body"
      className="grid w-full grid-cols-1 items-start gap-4 rounded-lg md:grid-cols-[16rem_1fr]"
    >
      <div
        id="club-content-left"
        className="order-2 flex h-full flex-col gap-4 md:order-1"
      >
        <EventCountdownCard
          id="countdown"
          startTime={event.startTime}
          endTime={event.endTime}
        />
        <EventHostClubCard id="host" club={event.club} />
        <EventDetailsCard id="details" event={event} />
        <ClubContactCard id="contact" club={event.club} />
        <div className="block md:hidden">{clubUpcomingEventsCard}</div>
      </div>
      <div
        id="club-content-right"
        className="order-1 flex min-w-0 flex-col gap-4 md:order-2"
      >
        <EventDescriptionCard id="description" event={event} />
        <div className="hidden md:block">{clubUpcomingEventsCard}</div>
      </div>
    </section>
  );
};

export default EventBody;
