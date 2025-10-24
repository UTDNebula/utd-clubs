import { type SelectClub } from '@src/server/db/models';
import AddOfficer from './AddOfficer';
import OfficerTable from './OfficerTable';
import ClubDescription from './ClubDescription';
import { api } from '@src/trpc/server';
import ChangeClubStatus from './ChangeClubStatus';

type Props = { club: SelectClub };
export default async function AcceptedClub({ club: club }: Props) {
  const officers = await api.club.getOfficers({ id: club.id });

  return (
    <>
      <h2 className="text-center text-2xl font-bold">Officers</h2>
      <div className="flex items-center justify-between">
        <AddOfficer clubId={club.id} />
        <ClubDescription club={club} />
      </div>
      <OfficerTable officers={officers} />
      <ChangeClubStatus status={club.approved} clubId={club.id} />
    </>
  );
}
