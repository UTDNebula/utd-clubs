import EventIcon from '@mui/icons-material/Event';
import PreviewIcon from '@mui/icons-material/Preview';
import { Button, Tooltip } from '@mui/material';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Collaborators from '@src/app/manage/[clubId]/(dashboard)/(forms)/Collaborators';
import AdminHeader from '@src/components/admin/AdminHeader';
import ChangeClubStatus from '@src/components/admin/ChangeClubStatus';
import DeleteClub from '@src/components/admin/DeleteClub';
import ClubHeader from '@src/components/club/listing/ClubHeader';
import ClubInfoSegment from '@src/components/club/listing/ClubInfoSegment';
import ClubUpcomingEvents from '@src/components/club/listing/ClubUpcomingEvents';
import ContactInformation from '@src/components/club/listing/ContactInformation';
import { api } from '@src/trpc/server';

type Props = { params: Promise<{ slug: string }> };

export default async function Page(props: Props) {
  const params = await props.params;

  const club = await api.club.getDirectoryInfo({ slug: params.slug });
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
        {club.approved === 'approved' && (
          <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
            <Tooltip title="Coming soon">
              <span>
                <Button
                  variant="contained"
                  className="normal-case whitespace-nowrap"
                  startIcon={<EventIcon />}
                  size="large"
                  disabled
                >
                  Events
                </Button>
              </span>
            </Tooltip>
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
        )}
      </AdminHeader>
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-col gap-8 w-full max-w-6xl">
          <ChangeClubStatus status={club.approved} clubId={club.id} />
          <Collaborators club={club} officers={officers} role="Admin" />
          <DeleteClub club={club} />
          {club.approved !== 'approved' && (
            <div className="mb-5 flex flex-col space-y-4 p-4">
              <ClubHeader club={club} />
              <ClubInfoSegment club={club} />
              {club.contacts.length > 0 && <ContactInformation club={club} />}
              {club.updatedAt && <ClubUpcomingEvents clubId={club.id} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
