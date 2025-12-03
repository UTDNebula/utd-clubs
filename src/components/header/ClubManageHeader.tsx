import type { ReactNode } from 'react';
// import { notFound } from 'next/navigation';
import type {
  SelectContact as Contacts,
  SelectClub,
} from '@src/server/db/models';
import BackButton from '../backButton';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};

type PathItem = {
  text: string;
  href?: string;
};

type ClubManageHeaderProps = {
  club: Club;
  children?: ReactNode;
  path?: PathItem[];
  hrefBack?: string;
};

const ClubManageHeader = ({
  club,
  children,
  path,
  hrefBack,
}: ClubManageHeaderProps) => {
  // const session = await getServerAuthSession();
  // if (!session) redirect(signInRoute(`manage/${club.id}`));
  // const canAccess = await api.club.isOfficer({ id: club.id });
  // if (!canAccess) {
  //   return <div className="">You can&apos;t access this 😢</div>;
  // }
  // const club = await api.club.byId({ id: club.id });
  // if (!club) {
  //   notFound();
  // }

  return (
    <div className="mb-8 flex w-full flex-row flex-wrap items-center gap-x-10 gap-y-2">
      <div className="flex min-h-10.5 flex-row items-center gap-x-2">
        <BackButton href={hrefBack} />
        {/* <h1 className="from-blue-primary bg-linear-to-br to-blue-700 bg-clip-text text-2xl font-bold text-transparent"> */}
        <h1 className="text-xl font-bold text-slate-800">{club.name}</h1>
        {/* TODO: Add key prop to elements somehow, for React */}
        {path?.map((pathItem, index) => {
          return (
            <span key={index}>
              <span className="text-xl font-bold text-slate-500 select-none">
                /&nbsp;
              </span>
              <span className="text-xl font-bold text-slate-800">
                {pathItem.text}
              </span>
            </span>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default ClubManageHeader;
