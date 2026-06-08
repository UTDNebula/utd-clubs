'use client';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PageHeader from '@src/components/common/PageHeader';

export default function CommunityHeader() {
  return (
    <PageHeader
      title="Community Events"
      tabs={[
        { label: 'Registered', href: '/community', icon: <HowToRegIcon /> },
        {
          label: 'Calendar',
          href: '/community/calendar',
          icon: <CalendarMonthIcon />,
        },
        {
          label: 'From Your Followed Clubs',
          href: '/community/more',
          icon: <PersonAddAlt1Icon />,
        },
      ]}
    ></PageHeader>
  );
}
