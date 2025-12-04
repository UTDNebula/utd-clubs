import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { notFound } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';
import Events from './Events';

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

  return (
    <main>
      <ClubManageHeader
        club={club}
        path={[{ text: 'Events', href: `/manage/${clubId}/events` }]}
        hrefBack={`/manage/${clubId}/`}
      >
        <Button
          href={`/manage/${clubId}/events/create`}
          variant="contained"
          className="normal-case"
          startIcon={<AddIcon />}
          size="large"
        >
          Create Event
        </Button>
      </ClubManageHeader>
      <Events clubId={clubId} />
    </main>
  );
}
