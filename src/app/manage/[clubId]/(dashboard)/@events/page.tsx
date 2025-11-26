import { format, isSameDay } from 'date-fns';
import Link from 'next/link';
import { MoreIcon } from '@src/icons/Icons';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';
import { revalidatePath } from "next/cache";
import EventDeleteButton from "@src/components/events/EventDeleteButton";

export async function deleteEventAction(eventId: string) {
    await api.event.delete({id: eventId});
    revalidatePath("/events", "page");
}

const Events = async (props: { params: Promise<{ clubId: string }> }) => {
  const params = await props.params;
  const events = await api.event.byClubId({ clubId: params.clubId });
  return (
    <div className="rounded-lg bg-white p-2 shadow-xs">
      <h3 className="text-blue-primary text-xl font-bold">Events</h3>
      <div className="flex flex-col space-y-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
export default Events;

const EventCard = ({
  event,
}: {
  event: RouterOutputs['event']['byClubId'][number];
}) => {
  return (
    <div className="container flex h-fit flex-row overflow-hidden rounded-lg bg-slate-100 shadow-xs transition-shadow hover:shadow-lg">
      <div className="flex flex-row px-6 py-5 items-center">
        <div className="flex flex-col space-y-2.5">
          <h3 className="font-bold">{event.name}</h3>
          <h4 className="text-xs font-bold">
            <span className="text-blue-primary">
              {format(event.startTime, 'E, MMM d, p')}
              {isSameDay(event.startTime, event.endTime) ? (
                <> - {format(event.endTime, 'p')}</>
              ) : (
                <> - {format(event.endTime, 'E, MMM d, p')}</>
              )}
            </span>
          </h4>
        </div>
        <div className="ml-auto flex-1 flex justify-center pl-6 items-center">
          <EventDeleteButton
              deleteAction={async () => {
                  "use server";
                  await deleteEventAction(event.id); // or the page route events live on
              }}
          />
        </div>
      </div>
    </div>
  );
};
