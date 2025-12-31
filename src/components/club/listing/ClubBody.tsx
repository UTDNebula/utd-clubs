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
      className="w-full rounded-lg grid grid-cols-1 lg:grid-cols-5 gap-5 items-start mt-8"
    >
      <div
        id="club-content-left"
        className="md:col-span-1 flex flex-col gap-4 h-full"
      >
        <ClubDetailsCard club={club} lastEventDate={lastEventDate} />
        <ClubContactCard club={club} />
        <OfficerList officers={club.officers} />
      </div>
      <div
        id="club-content-right"
        className="md:col-span-4 flex flex-col gap-4"
      >
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
