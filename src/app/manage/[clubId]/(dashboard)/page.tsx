import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PreviewIcon from '@mui/icons-material/Preview';
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
        <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
          <Link href={`/manage/${clubId}/members`}>
            <Button
              variant="contained"
              className="normal-case whitespace-nowrap"
              startIcon={<PeopleIcon />}
              size="large"
            >
              Members
            </Button>
          </Link>
          <Link href={`/manage/${clubId}/events`}>
            <Button
              variant="contained"
              className="normal-case whitespace-nowrap"
              startIcon={<EventIcon />}
              size="large"
            >
              Events
            </Button>
          </Link>
          <Link href={`/directory/${club.slug}`}>
            <Button
              variant="contained"
              className="normal-case whitespace-nowrap"
              startIcon={<PreviewIcon />}
              size="large"
            >
              Listing
            </Button>
          </Link>
        </div>
      </ClubManageHeader>
      <div className="flex w-full flex-col items-center">
        <ClubManageForm club={club} />
      </div>
    </>
  );
};
export default Page;
