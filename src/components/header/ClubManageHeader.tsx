import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';
import type { ReactNode } from 'react';
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
          {loading && <Skeleton variant="text" className="w-16" />}
          {/* All but last path items can be links */}
          {normalizedPath?.slice(0, -1).map((pathItem) => {
            if (pathItem.text === 'loading') {
              return <Skeleton variant="text" className="w-16" />;
            }
            if (pathItem.href) {
              return (
                <Link key={pathItem.href} href={pathItem.href}>
                  {pathItem.text}
                </Link>
              );
            }
            return <Typography key={pathItem.href}>{pathItem.text}</Typography>;
          })}
          {/* Last path item is just text */}
          {normalizedPath?.length &&
            (normalizedPath[normalizedPath.length - 1]?.text === 'loading' ? (
              <Skeleton variant="text" className="w-16" />
            ) : (
              <Typography>
                {normalizedPath[normalizedPath.length - 1]?.text}
              </Typography>
            ))}
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
};

export default ClubManageHeader;
