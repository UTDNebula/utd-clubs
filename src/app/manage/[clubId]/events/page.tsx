import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventCard from '@src/components/events/EventCard';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';

export default async function Page({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;

  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }

  const events = await api.event.byClubId({ clubId });

  return (
    <main>
      <ClubManageHeader
        club={club}
        path={[{ text: 'Events', href: `/manage/${clubId}/events` }]}
        hrefBack={`/manage/${clubId}/`}
      >
        <Link href={`/manage/${clubId}/events/create`}>
          <Button
            variant="contained"
            className="normal-case"
            startIcon={<AddIcon />}
            size="large"
          >
            Create Event
          </Button>
        </Link>
      </ClubManageHeader>
      <div
        className="group flex flex-wrap w-full justify-evenly items-center pt-4 gap-4"
        data-view="list"
      >
        {events?.map((event) => (
          <EventCard key={event.id} event={event} manageView />
        ))}
      </div>
    </main>
  );
}
