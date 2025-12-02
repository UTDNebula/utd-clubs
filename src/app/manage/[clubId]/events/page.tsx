import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { format, isSameDay } from 'date-fns';
import Link from 'next/link';
// import Header from '@src/components/header/BaseHeader';
import { notFound } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { MoreIcon } from '@src/icons/Icons';
import { api } from '@src/trpc/server';
import { type RouterOutputs } from '@src/trpc/shared';

export default async function Page({
  params,
  // events,
}: {
  params: { clubId: string };
  // events: ReactNode;
}) {
  // TODO: might need to add code here to only allow officers?
  const club = await api.club.byId({ id: params.clubId });
  if (!club) notFound();

  return (
    <main>
      <ClubManageHeader
        club={club}
        path={[{ text: 'Events' }]}
        hrefBack={`/manage/${params.clubId}/`}
      >
        <Button
          href={`/manage/${params.clubId}/create`}
          variant="contained"
          className="normal-case"
          startIcon={<AddIcon />}
          size="large"
        >
          Create Event
        </Button>
      </ClubManageHeader>
      {/* <h1>Not implemented yet, sorry!</h1> */}
      <div className="flex w-full flex-row gap-4">
        <Events params={{ clubId: params.clubId }} />
      </div>
    </main>
  );
}

const Events = async (props: { params: Promise<{ clubId: string }> }) => {
  const params = await props.params;
  const events = await api.event.byClubId({ clubId: params.clubId });
  return (
    <div className="rounded-lg bg-white p-4 shadow-xs w-full">
      <h3 className="text-haiti text-xl font-bold">Events</h3>
      <div
        className="group flex flex-wrap w-full justify-evenly items-center pt-4 gap-4"
        data-view="list"
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} manageView />
        ))}
      </div>
    </div>
  );
};
// export default Events;

const EventCard = ({
  event,
}: {
  event: RouterOutputs['event']['byClubId'][number];
}) => {
  return (
    <div className="container flex h-fit flex-row overflow-hidden rounded-lg bg-slate-100 shadow-xs transition-shadow hover:shadow-lg">
      <div className="flex w-full flex-row px-6 py-5">
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
        <div className="ml-auto flex flex-row space-x-4">
          <Link
            className="bg-blue-primary h-10 w-10 rounded-full p-1.5 shadow-lg transition-colors hover:bg-blue-700 active:bg-blue-800"
            href={`/event/${event.id}`}
            passHref
          >
            <MoreIcon fill="fill-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};
