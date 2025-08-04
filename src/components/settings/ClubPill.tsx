import { type SelectClub } from '@src/server/db/models';
import Image from 'next/image';

export default function ClubPill({ club }: { club: SelectClub }) {
  return (
    <div className="m-5 flex min-w-[10rem] items-center justify-center rounded-full border p-2">
      <Image
        src={club.profileImage ?? '/nebula-logo.png'}
        alt={club.name}
        width={40}
        height={40}
        className="-pl-1 rounded-full pr-1"
      />
      <h1 className="truncate p-1 text-xs font-bold">{club.name}</h1>
      <button className="ml-2 text-xs font-bold text-red-500">X</button>
    </div>
  );
}
