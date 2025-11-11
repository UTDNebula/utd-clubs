import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PreviewIcon from '@mui/icons-material/Preview';
import Button from '@mui/material/Button';
import { notFound, redirect } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import ClubManageForm from './ClubManageForm';

const Page = async ({ params }: { params: { clubId: string } }) => {
  const session = await getServerAuthSession();
  if (!session) redirect(signInRoute(`manage/${params.clubId}`));
  const canAccess = await api.club.isOfficer({ id: params.clubId });
  if (!canAccess) {
    return <div className="">You can&apos;t access this 😢</div>;
  }
  const club = await api.club.byId({ id: params.clubId });
  if (!club) {
    notFound();
  }
  return (
    <>
      <ClubManageHeader club={club} hrefBack="/manage/">
        <Button
          href={`/manage/${params.clubId}/members`}
          variant="contained"
          className="normal-case"
          startIcon={<PeopleIcon />}
          size="large"
        >
          View Members
        </Button>
        <Button
          href={`/manage/${params.clubId}/events`}
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

      <ClubManageForm club={club} />
    </>
  );
};
export default Page;
