import { Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import type {
  SelectContact as Contacts,
  SelectClub,
} from '@src/server/db/models';
import { api } from '@src/trpc/server';
import JoinButton from '../JoinButton';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};
const ClubHeader = async ({ club }: { club: Club }) => {
  const memberType = await api.club.memberType({ id: club.id });
  return (
    <div className="relative min-h-64 rounded-lg overflow-hidden">
      <Image
        src={club.bannerImage ?? '/images/wideWave.jpg'}
        alt="Club banner"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="relative z-10 flex flex-wrap h-full w-full items-center p-4 md:p-20 gap-4">
        <h1
          className={`font-display font-bold text-slate-100 text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)] ${
            club.name.length > 10 ? 'text-3xl' : 'text-5xl'
          }`}
        >
          {club.name}
        </h1>
        <div className="ml-auto flex items-center gap-x-6">
          {memberType === 'Officer' || memberType === 'President' ? (
            <Link href={`/manage/${club.id}`}>
              <Button variant="contained" size="large" className="normal-case">
                Manage
              </Button>
            </Link>
          ) : (
            <JoinButton isHeader clubID={club.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubHeader;
