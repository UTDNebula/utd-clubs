import PillButton from '@src/components/PillButton';
import {
  EyeIcon,
  GroupIcon,
  PencilIcon,
  PersonIcon,
  PlusIcon,
} from '@src/icons/Icons';

const Page = ({ params }: { params: { clubId: string } }) => {
  return (
    <>
      <div className="flex flex-row flex-wrap gap-x-10 gap-y-4 rounded-lg bg-white p-2 shadow-xs">
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
      </div>
    </>
  );
};
export default Page;
