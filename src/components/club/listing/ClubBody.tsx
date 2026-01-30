import { TZDateMini } from '@date-fns/tz';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';
import ClubContactCard from './ClubContactCard';
import ClubDescriptionCard from './ClubDescriptionCard';
import ClubDetailsCard from './ClubDetailsCard';
import ClubMembershipFormsCard from './ClubMembershipFormsCard';
import ClubUpcomingEventsCard from './ClubUpcomingEventsCard';
import OfficerList from './OfficerList';

const ClubBody = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  const now = TZDateMini.tz('America/Chicago');
  const oneYearAgo = TZDateMini.tz('America/Chicago');
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const events = await api.event.clubUpcoming({
    clubId: club.id,
    currentTime: now,
  });
  const forms = await api.club.clubForms({
    id: club.id,
  });

  return (
    <section
      id="club-body"
      className="w-full rounded-lg grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-4 items-start"
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
        {forms && (
          <ClubMembershipFormsCard
            id="membership-forms"
            heading="Forms"
            membershipForms={forms}
            emptyText="No Forms"
          />
        )}
        <ClubUpcomingEventsCard
          id="upcoming-events"
          heading="Upcoming Events"
          upcomingEvents={events}
          emptyText={
            club.updatedAt == null || club.updatedAt < oneYearAgo
              ? 'No info about upcoming events'
              : 'There are no upcoming events'
          }
        />
      </div>
    </section>
  );
};

export default ClubBody;
