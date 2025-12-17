import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PreviewIcon from '@mui/icons-material/Preview';
import Button from '@mui/material/Button';
import { HydrationBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ManageHeader from '@src/components/manage/ManageHeader';
import { api, getQueryClient } from '@src/trpc/server';
import ClubManageForm from './ClubManageForm';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const club = await api.club.bySlug({ slug });

  if (!club) {
    notFound();
  }
  return (
    <>
      <ManageHeader club={club} hrefBack="/manage">
        <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
          <Link href={`/manage/${slug}/members`}>
            <Button
              variant="contained"
              className="normal-case whitespace-nowrap"
              startIcon={<PeopleIcon />}
              size="large"
            >
              Members
            </Button>
          </Link>
          <Link href={`/manage/${slug}/events`}>
            <Button
              variant="contained"
              className="normal-case whitespace-nowrap"
              startIcon={<EventIcon />}
              size="large"
            >
              Events
            </Button>
          </Link>
          {club.approved === 'approved' && (
            <Link href={`/directory/${slug}`}>
              <Button
                variant="contained"
                className="normal-case whitespace-nowrap"
                startIcon={<PreviewIcon />}
                size="large"
              >
                Listing
              </Button>
            </Link>
          )}
        </div>
      </ManageHeader>
      <div className="flex w-full flex-col items-center">
        <ClubManageForm club={club} />
      </div>
    </>
  );
};
export default Page;
