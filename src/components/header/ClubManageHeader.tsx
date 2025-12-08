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

type PathItem =
  | {
      text: string;
      href?: string;
    }
  | string;

type ClubManageHeaderBaseProps = {
  children?: ReactNode;
  path?: PathItem[];
  hrefBack?: string;
};

type ClubManageHeaderProps =
  | (ClubManageHeaderBaseProps & { club: Club; loading?: never })
  | (ClubManageHeaderBaseProps & { club?: never; loading: true });

/**
 * Requires either a `club` prop or a `loading` prop flag
 */
const ClubManageHeader = ({
  club,
  loading,
  children,
  path,
  hrefBack,
}: ClubManageHeaderProps) => {
  const normalizedPath = path?.map((pathItem) => {
    if (typeof pathItem === 'string') {
      return { text: pathItem };
    } else {
      return pathItem;
    }
  });

  return (
    <div className="mb-8 flex w-full flex-row flex-wrap items-center gap-x-10 gap-y-2">
      <div className="flex min-h-10.5 flex-row items-center gap-2">
        <BackButton href={hrefBack} />
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/manage">Manage</Link>
          {club && (
            <Link className="font-bold" href={`/manage/${club.id}`}>
              {club.name}
            </Link>
          )}
          {loading && <span className="italic">Loading...</span>}
          {normalizedPath?.slice(0, -1).map((pathItem) => {
            return pathItem.href ? (
              <Link key={pathItem.href} href={pathItem.href}>
                {pathItem.text}
              </Link>
            ) : (
              <Typography key={pathItem.href}>{pathItem.text}</Typography>
            );
          })}
          {normalizedPath?.length && (
            <Typography>
              {normalizedPath[normalizedPath.length - 1]?.text}
            </Typography>
          )}
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
};

export default ClubManageHeader;
