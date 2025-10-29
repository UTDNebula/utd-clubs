import Link from 'next/link';
import { type SelectClub } from '@src/server/db/models';

const ClubCard = ({ club }: { club: SelectClub }) => {
  return (
    <Link
      className="flex w-fit flex-col rounded-lg bg-white p-4 shadow-xs"
      href={`/manage/${club.id}`}
    >
      <h2 className="text-blue-primary text-lg font-bold">{club.name}</h2>
    </Link>
  );
};
export default ClubCard;
