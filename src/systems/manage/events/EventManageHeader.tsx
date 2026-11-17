// Required so tab icons render correctly (same as CommunityHeader.tsx)
'use client';

import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Skeleton from '@mui/material/Skeleton';
import { LinkButton } from '@/lib/components/LinkButton';
import PageHeader from '@/lib/components/PageHeader';

type EventManageHeaderProps = {
  slug: string;
  eventId: string;
  eventName: string;
};

export default function EventManageHeader({
  slug,
  eventId,
  eventName,
}: EventManageHeaderProps) {
  const basePath = `/manage/${slug}/event/${eventId}`;

  return (
    <PageHeader
      title={eventName}
      backButton={{
        type: 'link',
        title: 'Manage club',
        href: `/manage/${slug}/events`,
      }}
      tabs={[
        { label: 'Details', href: basePath, icon: <EditIcon /> },
        {
          label: 'Registration',
          href: `${basePath}/registration`,
          icon: <ListAltIcon />,
        },
        {
          label: 'Attendance',
          href: `${basePath}/attendance`,
          icon: <PersonAddAltIcon />,
        },
      ]}
      // Let the tab row scroll sideways on phones instead of widening the page
      slotProps={{ tabs: { variant: 'scrollable', scrollButtons: false } }}
    >
      <LinkButton
        href={`/events/${eventId}`}
        variant="contained"
        startIcon={<OpenInNewIcon />}
        className="normal-case"
      >
        View listing page
      </LinkButton>
    </PageHeader>
  );
}

/**
 * Placeholder shown by loading.tsx while the event loads, roughly matching
 * the header's back link, title, and tab bar so the page doesn't jump.
 */
export function EventManageHeaderSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3 border-b-1 border-[var(--mui-palette-divider)] px-4 py-2">
      <Skeleton variant="text" className="w-28" />
      <Skeleton variant="text" className="h-12 w-64" />
      <Skeleton variant="text" className="h-14 w-80" />
    </div>
  );
}
