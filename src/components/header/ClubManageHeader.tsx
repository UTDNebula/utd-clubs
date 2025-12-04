import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
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
  href: string;
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
  return (
    <div className="mb-8 flex w-full flex-row flex-wrap items-center gap-x-10 gap-y-2">
      <div className="flex min-h-10.5 flex-row items-center gap-2">
        <BackButton href={hrefBack} />
        <Breadcrumbs aria-label="breadcrumb">
          <Link className="font-bold" href={`/manage/${club.id}`}>
            {club.name}
          </Link>
          {path?.slice(0, -1).map((pathItem) => {
            return (
              <Link key={pathItem.href} href={pathItem.href}>
                {pathItem.text}
              </Link>
            );
          })}
          {path?.length && (
            <Typography>{path[path.length - 1]?.text}</Typography>
          )}
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
};

export default ClubManageHeader;
