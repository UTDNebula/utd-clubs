import EventIcon from '@mui/icons-material/Event';
import PreviewIcon from '@mui/icons-material/Preview';
import { notFound } from 'next/navigation';
import Collaborators from '@src/systems/manage/forms/Collaborators';
import DeleteClub from '@src/systems/manage/forms/DeleteClub';
import AdminHeader from '@src/systems/admin/AdminHeader';
import ChangeClubStatus from '@src/systems/admin/ChangeClubStatus';
import ClubBody from '@src/systems/clubs/listing/ClubBody';
import ClubEventHeader from '@src/systems/clubs/listing/ClubEventHeader';
import ClubTitle from '@src/systems/clubs/listing/ClubTitle';
import { LinkButton } from '@src/components/LinkButton';
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
        <div className="flex flex-wrap items-center gap-x-10 gap-y-2 max-sm:gap-x-4">
          <LinkButton
            href={`/admin/clubs/${club.slug}/events`}
            variant="contained"
            className="whitespace-nowrap normal-case"
            startIcon={<EventIcon />}
            size="large"
          >
            Events
          </LinkButton>
          {club.approved === 'approved' && (
            <LinkButton
              href={`/directory/${club.slug}`}
              variant="contained"
              className="whitespace-nowrap normal-case"
              startIcon={<PreviewIcon />}
              size="large"
            >
              Listing
            </LinkButton>
          )}
        </div>
      </AdminHeader>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-6xl flex-col gap-8">
          <ChangeClubStatus club={club} />
          <Collaborators club={club} officers={officers} role="Admin" />
          <DeleteClub view="admin" club={club} />
          {club.approved !== 'approved' && (
            <div className="mx-auto mb-5 flex max-w-6xl flex-col gap-y-6 p-4">
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
