'use client';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import ListIcon from '@mui/icons-material/List';
import PageHeader from '@/lib/components/PageHeader';

export default function ClubDirectoryHeader() {
  return (
    <PageHeader
      title="Clubs"
      tabs={[
        { label: 'Explore Clubs', href: '/clubs', icon: <ListIcon /> },
        { label: 'Club Match', href: '/club-match', icon: <Diversity3Icon /> },
      ]}
    />
  );
}
