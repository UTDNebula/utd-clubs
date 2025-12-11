import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';
import type { ReactNode } from 'react';
import BackButton from '@src/components/BackButton';
import type { SelectClub } from '@src/server/db/models';

type PathItem =
  | {
      text: string;
      href?: string;
    }
  | string;

type ManageHeaderBaseProps = {
  children?: ReactNode;
  path?: PathItem[];
  hrefBack?: string;
};

type ManageHeaderProps =
  | (ManageHeaderBaseProps & { club?: SelectClub; loading?: never })
  | (ManageHeaderBaseProps & { club?: never; loading: true });

/**
 * Requires either a `club` prop or a `loading` prop flag.
 * `club` is only optional on the choose a club page.
 */
const ManageHeader = ({
  club,
  loading,
  children,
  path,
  hrefBack,
}: ManageHeaderProps) => {
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
          {club || loading ? (
            <Link href="/manage">Manage</Link>
          ) : (
            <Typography>Manage</Typography>
          )}
          {club &&
            (normalizedPath?.length ? (
              <Link className="font-bold" href={`/manage/${club.slug}`}>
                {club.name}
              </Link>
            ) : (
              <Typography className="font-bold">{club.name}</Typography>
            ))}
          {loading && <Skeleton variant="text" className="w-16" />}
          {/* All but last path items can be links */}
          {normalizedPath?.slice(0, -1).map(({ text, href }, index) => {
            if (text === 'loading') {
              return (
                <Skeleton key={text + index} variant="text" className="w-16" />
              );
            }
            if (href) {
              return (
                <Link key={text + href} href={href}>
                  {text}
                </Link>
              );
            }
            return <Typography key={text + href}>{text}</Typography>;
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

export default ManageHeader;
