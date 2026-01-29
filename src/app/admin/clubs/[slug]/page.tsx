import EventIcon from '@mui/icons-material/Event';
import PreviewIcon from '@mui/icons-material/Preview';
import { Button } from '@mui/material';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Collaborators from '@src/app/manage/[slug]/(dashboard)/(forms)/Collaborators';
import DeleteClub from '@src/app/manage/[slug]/(dashboard)/(forms)/DeleteClub';
import AdminHeader from '@src/components/admin/AdminHeader';
import ChangeClubStatus from '@src/components/admin/ChangeClubStatus';
import ClubBody from '@src/components/club/listing/ClubBody';
import ClubEventHeader from '@src/components/club/listing/ClubEventHeader';
import ClubTitle from '@src/components/club/listing/ClubTitle';
import { api } from '@src/trpc/server';

type Props = { params: Promise<{ slug: string }> };

export default async function Page(props: Props) {
  const params = await props.params;

  const club = await api.admin.getDirectoryInfo({ slug: params.slug });
  if (!club) {
    notFound();
  }

  const officers = await api.club.getOfficers({ id: club.id });

  return (
    <>
      <AdminHeader
        path={[
          { text: 'Admin', href: '/admin' },
          { text: 'Clubs', href: '/admin/clubs' },
          club.name,
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
          <Button
            LinkComponent={Link}
            href={`/admin/clubs/${club.slug}/events`}
            variant="contained"
            className="normal-case whitespace-nowrap"
            startIcon={<EventIcon />}
            size="large"
          >
            Events
          </Button>
          {club.approved === 'approved' && (
            <Button
              LinkComponent={Link}
              href={`/directory/${club.slug}`}
              variant="contained"
              className="normal-case whitespace-nowrap"
              startIcon={<PreviewIcon />}
              size="large"
            >
              Listing
            </Button>
          )}
        </div>
      </AdminHeader>
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-col gap-8 w-full max-w-6xl">
          <ChangeClubStatus club={club} />
          <Collaborators club={club} officers={officers} role="Admin" />
          <DeleteClub view="admin" club={club} />
          {club.approved !== 'approved' && (
            <div className="mb-5 flex flex-col gap-y-6 p-4 max-w-6xl mx-auto">
              <ClubEventHeader club={club} />
              <ClubTitle club={club} />
              <ClubBody club={club} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
