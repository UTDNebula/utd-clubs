import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { notFound } from 'next/navigation';
import FormFieldSet from '@src/components/club/manage/form/FormFieldSet';
import EventCard from '@src/components/events/EventCard';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';

export default async function Page({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;

  // TODO: might need to add code here to only allow officers?

  const club = await api.club.byId({ id: clubId });
  if (!club) notFound();

  return (
    <main>
      <ClubManageHeader
        club={club}
        path={[{ text: 'Events' }]}
        hrefBack={`/manage/${clubId}/`}
      >
        <Button
          href={`/manage/${clubId}/create`}
          variant="contained"
          className="normal-case"
          startIcon={<AddIcon />}
          size="large"
        >
          Create Event
        </Button>
      </ClubManageHeader>
      <FormFieldSet legend="Events">
        <Events clubId={clubId} />
      </FormFieldSet>
    </main>
  );
}

const Events = async (props: { clubId: string }) => {
  const events = await api.event.byClubId({ clubId: props.clubId });
  return (
    <div
      className="group flex flex-wrap w-full justify-evenly items-center pt-4 gap-4"
      data-view="list"
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} manageView />
      ))}
    </div>
  );
};
