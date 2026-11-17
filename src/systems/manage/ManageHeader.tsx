
'use client'; 
import Diversity1Icon from '@mui/icons-material/Diversity1'; // for the new icons 
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useParams, usePathname } from 'next/navigation';
import PageHeader, { PageHeaderTab } from '@/lib/components/PageHeader';
// import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';
import type { ReactNode } from 'react';
import BackButton from '@/lib/components/BackButton';
import type { SelectClub } from '@/server/db/models';

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
  children,
  path,
  hrefBack,
}: ManageHeaderProps) => {
  const pathname = usePathname();
 
  const params = useParams() as { slug: string };
  const slug = club?.slug ?? params.slug;

  const normalizedPath = path?.map((pathItem) =>
    typeof pathItem === 'string' ? { text: pathItem } : pathItem,
  );

  // empty case 
  if (!slug) {
    return (
      <div className="mb-8">
        <PageHeader title="Manage">{children}</PageHeader>
      </div>
    );
  }

  // new header tabs design 
  const base = `/manage/${slug}`; // club 
  const tabs: PageHeaderTab[] = [
    { label: 'Manage', href: base, icon: <SettingsOutlinedIcon /> },
    { label: 'Engagement', href: `${base}/engagement`, icon: <Diversity1Icon /> },
    { label: 'Members', href: `${base}/followers`, icon: <PersonOutlinedIcon /> },
    { label: 'Events', href: `${base}/events`, icon: <CalendarTodayOutlinedIcon /> },
  ];

  const isTabPage = tabs.some((tab) => tab.href === pathname); // check if the current page is one of the tab pages

  if (isTabPage) {
    return (
      // mb-8 keeps the same space below the header as the old version.
      <div className="mb-8">
        <PageHeader
          title={club?.name} // blank while loading, then fills in
          variant="compact" // puts the tabs on the same row as the title
          backButton={{ href: hrefBack ?? '/manage', title: 'Back to Manage' }}
          tabs={tabs}
        >
          {children}
        </PageHeader>
      </div>
    );
  }

  const title = normalizedPath
    ?.map(({ text }) => text)
    .filter((text) => text !== 'loading')
    .join(' / ');

  return (
    <div className="mb-8">
      <PageHeader // pass params to page header to display the title and subtitle
        title={title}
        subtitle={club?.name} // club name 
        backButton={{ href: hrefBack }} // back button 
      >
        {children}
      </PageHeader>
    </div>
  );
};

export default ManageHeader;
