import { notFound, redirect } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import PillButton from '@src/components/PillButton';
import {
  EyeIcon,
  // PlusIcon,
  // PencilIcon,
  GroupIcon,
  // PersonIcon,
} from '@src/icons/Icons';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import ClubManageForm from './ClubManageForm';


// import TestForm from './TestForm';

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
      <ClubManageHeader club={club}>
        <PillButton
          href={`/manage/${params.clubId}/members`}
          IconComponent={GroupIcon}
        >
          View Members
        </PillButton>
        <PillButton
          href={`/manage/${params.clubId}/events`}
          IconComponent={EyeIcon}
        >
          View Events
        </PillButton>

        {/* This should open a modal that displays the ClubCard component for the club */}
        <PillButton href={`/directory/${club.slug}`} IconComponent={EyeIcon}>
          Preview Club Card
        </PillButton>
      </ClubManageHeader>

      {/* <div className="flex w-full items-center justify-center">
        <main className="w-full max-w-6xl"> */}

      <ClubManageForm club={club} />

      {/* <h2>Test Form</h2>
      <TestForm club={club} /> */}

      {/* <div className="flex flex-row flex-wrap gap-x-10 gap-y-4 rounded-lg bg-white p-2 shadow-xs">
            <PillButton
              href={`/manage/${params.clubId}/edit`}
              IconComponent={PencilIcon}
            >
              Edit Club Data
            </PillButton>
            <PillButton
              href={`/manage/${params.clubId}/edit/officers`}
              IconComponent={PersonIcon}
            >
              Manage Officers
            </PillButton>
            <PillButton IconComponent={GroupIcon} disabled>
              View members
            </PillButton>
            <PillButton IconComponent={EyeIcon} disabled>
              View Events
            </PillButton>
            <PillButton
              href={`/manage/${params.clubId}/create`}
              IconComponent={PlusIcon}
            >
              Create Event
            </PillButton>
          </div> */}
      {/* </main>
      </div> */}
    </>
  );
};
export default Page;
