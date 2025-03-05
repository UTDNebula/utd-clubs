import Image from 'next/image';
import ContactButtons from './ContactButtons';
import type {
  SelectClub,
  SelectContact as Contacts,
} from '@src/server/db/models';
import JoinButton from '../JoinButton';
import { getServerAuthSession } from '@src/server/auth';
import Link from 'next/link';
import { api } from '@src/trpc/server';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};
const ClubHeader = async ({ club }: { club: Club }) => {
  const session = await getServerAuthSession();
  const memberType = await api.club.memberType({ id: club.id });
  return (
    <div className="relative">
      <div className="h-full w-full">
        <Image
          src={'/images/wideWave.jpg'}
          alt="Picture of the club"
          style={{
            width: '100%',
            height: 'auto',
          }}
          height={150}
          width={450}
          className="rounded-lg object-cover"
          priority
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-full flex items-center p-8">
        <h1
          className={`font-bold text-slate-100 ${
            club.name.length > 10 ? 'text-3xl' : 'text-5xl'
          }`}
        >
          {club.name}
        </h1>
        <div className="ml-auto flex items-center gap-x-6">
          {memberType === 'Officer' || memberType === 'President' ? (
            <Link
              href={`/manage/${club.id}`}
              className="rounded-full bg-blue-primary p-2.5 text-white transition-colors hover:bg-blue-700"
            >
              Manage
            </Link>
          ) : (
            <JoinButton
              session={session}
              isHeader
              clubID={club.id}
              isJoined={memberType !== undefined}
            />
          )}
          <ContactButtons contacts={club.contacts || []} />
        </div>
      </div>
    </div>
  );
};

export default ClubHeader;
