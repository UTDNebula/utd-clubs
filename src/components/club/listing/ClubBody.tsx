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

  const [events, forms] = await Promise.all([
    api.event.clubUpcoming({
      clubId: club.id,
      currentTime: now,
    }),
    api.club.clubForms({
      id: club.id,
    }),
  ]);

  return (
    <section
      id="club-body"
      className="grid w-full grid-cols-1 items-start gap-4 rounded-lg md:grid-cols-[16rem_1fr]"
    >
      <div
        id="club-content-left"
        className="order-2 flex h-full flex-col gap-4 md:order-1"
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
        className="order-1 flex min-w-0 flex-col gap-4 md:order-2"
      >
        <ClubDescriptionCard id="description" club={club} />
        {forms.length !== 0 && (
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
              : "This club hasn't posted info about upcoming events"
          }
        />
      </div>
    </section>
  );
};

export default ClubBody;
