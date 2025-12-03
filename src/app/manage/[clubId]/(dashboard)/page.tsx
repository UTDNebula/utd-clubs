import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PreviewIcon from '@mui/icons-material/Preview';
import Button from '@mui/material/Button';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import ClubManageForm from './ClubManageForm';

// const Page = async ({ params }: { params: Promise<{ clubId: string }> }) => {
//   const { clubId } = await params;
const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const { clubId } = await props.params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute(`manage/${clubId}`));
  const canAccess = await api.club.isOfficer({ id: clubId });
  if (!canAccess) {
    return <div className="">You can&apos;t access this 😢</div>;
  }
  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }
  return (
    <>
      <ClubManageHeader club={club} hrefBack="/manage/">
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

      <ClubManageForm club={club} />
    </>
  );
};
export default Page;
