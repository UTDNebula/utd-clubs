import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import Button from '@mui/material/Button';
import Link from 'next/link';
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
        <Link href={`/manage/${clubId}/members`}>
          <Button
            variant="contained"
            className="normal-case"
            startIcon={<PeopleIcon />}
            size="large"
          >
            View Members
          </Button>
        </Link>
        <Link href={`/manage/${clubId}/events`}>
          <Button
            variant="contained"
            className="normal-case"
            startIcon={<EventIcon />}
            size="large"
          >
            View Events
          </Button>
        </Link>
      </ClubManageHeader>
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-6xl">
          <ClubManageForm club={club} />
        </div>
      </div>
    </>
  );
};
export default Page;
