import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';

const Events = async (props: { params: Promise<{ clubId: string }> }) => {
  const params = await props.params;
  const events = await api.event.byClubId({ clubId: params.clubId });
  return (
    <div className="rounded-lg bg-white p-4 shadow-xs w-full">
      <h3 className="text-haiti text-xl font-bold">Events</h3>
      <div
        className="group flex flex-wrap w-full items-center pt-4 gap-4"
        data-view={'list'}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} adminEvent />
        ))}
      </div>
    </div>
  );
};
export default Events;
