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
    <section
      id="club-body"
      className="w-full rounded-lg grid grid-cols-1 md:grid-cols-[256px_1fr] gap-4 items-start"
    >
      <div id="club-content-left" className="flex flex-col gap-4 h-full">
        <ClubDetailsCard club={club} lastEventDate={lastEventDate} />
        <ClubContactCard club={club} />
        <OfficerList officers={club.officers} />
      </div>
      <div id="club-content-right" className="flex flex-col gap-4">
        <ClubDescriptionCard club={club} />
        <ClubUpcomingEventsCard
          club={club}
          upcomingEvents={upcomingEvents}
          oneYearAgo={oneYearAgo}
        />
      </div>
    </section>
  );
};

export default ClubBody;
