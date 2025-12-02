import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { notFound } from 'next/navigation';
import FormFieldSet from '@src/components/club/manage/form/FormFieldSet';
import EventCard from '@src/components/events/EventCard';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';

// import { type RouterOutputs } from '@src/trpc/shared';

export default async function Page({ params }: { params: { clubId: string } }) {
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
      <FormFieldSet legend="Events">
        {/* I dunno how to solve this, it works without but tbh somebody should fix this /shrug */}
        <Events params={{ clubId: params.clubId }} />
      </FormFieldSet>
    </main>
  );
}

const Events = async (props: { params: Promise<{ clubId: string }> }) => {
  const params = await props.params;
  const events = await api.event.byClubId({ clubId: params.clubId });
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
