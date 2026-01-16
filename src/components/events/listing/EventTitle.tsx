import Image from 'next/image';
import { ClubTags } from '@src/components/common/ClubTags';
import EventRegisterButton from '@src/components/events/EventRegisterButton';
import { SelectClub } from '@src/server/db/models';
import { type RouterOutputs } from '@src/trpc/shared';

const EventTitle = async ({
  event,
}: {
  event: NonNullable<RouterOutputs['event']['getListingInfo']>;
}) => {
  return (
    <section
      id="event-title"
      className="w-full rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-0 mt-2"
    >
      <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
        {event.name && (
          <h1
            className={`font-display font-bold text-slate-800 ${
              event.name.length > 40
                ? 'text-xl md:text-3xl'
                : event.name.length > 12
                  ? 'text-2xl md:text-5xl'
                  : 'text-4xl md:text-5xl'
            }`}
          >
            {event.name}
          </h1>
        )}
        <div>When | Duration | Loacation</div>
      </div>
      <div className="w-full md:w-auto flex-shrink-0 flex md:ml-auto justify-end">
        <EventRegisterButton
          isHeader
          clubId={event.club.id}
          clubSlug={event.club.slug}
          eventId={event.id}
        />
      </div>
    </section>
  );
};

export default EventTitle;
