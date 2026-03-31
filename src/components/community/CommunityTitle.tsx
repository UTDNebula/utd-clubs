'use client';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExploreIcon from '@mui/icons-material/Explore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import SyncIcon from '@mui/icons-material/Sync';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';

type CommunityTitleProps = {
  selectedCount?: number;
  totalCount?: number;
};

export default function CommunityTitle({
  selectedCount,
  totalCount,
}: CommunityTitleProps) {
  const pathname = usePathname();
  const tabPaths = ['/community', '/community/calendar'];
  const tabIndex = tabPaths.indexOf(pathname);

  const [selectedTab, setSelectedTab] = useState(
    tabIndex !== -1 ? tabIndex : 0,
  );

  const handleChangeTab = (e: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="flex justify-between gap-4 border-b-1 border-[var(--mui-palette-divider)]">
      <div className="sm:mt-2 grow sm:ml-4">
        <div className="flex gap-3 items-end py-4 max-sm:hidden">
          <h1 className="font-display text-3xl font-semibold">My Community</h1>
          {(selectedCount || totalCount) && (
            <span className="text-xl text-neutral-600 dark:text-neutral-400">
              ({selectedCount}
              {selectedCount ? (totalCount ? ' out of ' : ' selected') : ''}
              {totalCount})
            </span>
          )}
        </div>
        <div className="flex items-center justify-between grow max-sm:mx-4 relative">
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            className="[&_.MuiTab-root]:min-h-14"
          >
            <Tab
              label="Feed"
              icon={<ExploreIcon />}
              iconPosition="start"
              LinkComponent={Link}
              href="/community"
            />
            <Tab
              label="Calendar"
              icon={<CalendarMonthIcon />}
              iconPosition="start"
              // disabled
              LinkComponent={Link}
              href="/community/calendar"
            />
          </Tabs>
          <Tooltip title="Coming soon">
            <span>
              <IconButton
                className="sm:hidden text-neutral-600 dark:text-neutral-400"
                disabled
              >
                <MoreVertIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-4 items-center max-sm:hidden">
        <Tooltip title="Coming soon">
          <span>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              disableElevation
              startIcon={<RssFeedIcon />}
              disabled
            >
              Subscribe
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Coming soon (probably not)">
          <span>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              disableElevation
              startIcon={<SyncIcon />}
              disabled
            >
              Sync
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
