import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PreviewIcon from '@mui/icons-material/Preview';
import Button from '@mui/material/Button';
import { notFound } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';
import ClubManageForm from './ClubManageForm';

const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const { clubId } = await props.params;

  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }

  return (
    <>
      <ClubManageHeader club={club} hrefBack="/manage">
        <Button
          href={`/manage/${clubId}/members`}
          variant="contained"
          className="normal-case"
          startIcon={<PeopleIcon />}
          size="large"
        >
          View Members
        </Button>
        <Button
          href={`/manage/${clubId}/events`}
          variant="contained"
          className="normal-case"
          startIcon={<EventIcon />}
          size="large"
        >
          View Events
        </Button>
        <Button
          href={`/directory/${club.slug}`}
          variant="contained"
          className="normal-case"
          startIcon={<PreviewIcon />}
          size="large"
        >
          Preview Club Card
        </Button>
      </ClubManageHeader>
      <div className="flex w-full flex-col items-center">
        <main className="w-full max-w-6xl">
          <ClubManageForm club={club} />
        </main>
      </div>
    </>
  );
};
export default Page;
