import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';
import type { ReactNode } from 'react';
import BackButton from '@src/components/BackButton';

type PathItem =
  | {
      text: string;
      href?: string;
    }
  | string;

type AdminHeaderProps = {
  children?: ReactNode;
  path?: PathItem[];
};

const AdminHeader = ({ children, path }: AdminHeaderProps) => {
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
        <BackButton href={normalizedPath?.[normalizedPath.length - 2]?.href} />
        <Breadcrumbs aria-label="breadcrumb">
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

export default AdminHeader;
