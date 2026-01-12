import { TZDateMini } from '@date-fns/tz';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';
import ClubContactCard from './ClubContactCard';
import ClubDescriptionCard from './ClubDescriptionCard';
import ClubDetailsCard from './ClubDetailsCard';
import ClubUpcomingEventsCard from './ClubUpcomingEventsCard';
import OfficerList from './OfficerList';

const ClubBody = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  const now = TZDateMini.tz('America/Chicago');

  const events = await api.event.clubUpcoming({
    clubId: club.id,
    currentTime: now,
  });

  return (
    <section
      id="club-body"
      className="w-full rounded-lg grid grid-cols-1 md:grid-cols-[256px_1fr] gap-4 items-start"
    >
      <div
        id="club-content-left"
        className="flex flex-col gap-4 h-full order-2 md:order-1"
      >
        <ClubDetailsCard
          id="details"
          club={club}
          lastEventDate={club.lastEventDate}
        />
        <ClubContactCard id="contact" club={club} />
        <OfficerList id="officers" officers={club.officers} />
      </div>
      <div
        id="club-content-right"
        className="flex flex-col gap-4 order-1 md:order-2"
      >
        <ClubDescriptionCard id="description" club={club} />
        <ClubUpcomingEventsCard
          id="upcoming-events"
          club={club}
          upcomingEvents={events}
        />
      </div>
    </section>
  );
};

export default ClubBody;
