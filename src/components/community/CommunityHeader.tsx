// Required to resolve hydration error and visible issue with tab icons
'use client';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import PageHeader from '@src/components/common/PageHeader';

export default function CommunityHeader() {
  return (
    <PageHeader
      title="Community Events"
      tabs={[
        { label: 'Events', href: '/community', icon: <EventIcon /> },
        {
          label: 'My Calendar',
          href: '/community/calendar',
          icon: <CalendarMonthIcon />,
        },
      ]}
    />
  );
}
