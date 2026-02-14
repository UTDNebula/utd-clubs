'use client';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { SyntheticEvent, useState } from 'react';

type EventsTitleProps = {
  selectedCount?: number;
  totalCount?: number;
};

const EventsTitle = ({ selectedCount, totalCount }: EventsTitleProps) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (e: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="flex justify-between gap-4 border-b-1 border-[var(--mui-palette-divider)]">
      <div className="mt-2 grow sm:ml-4">
        <div className="flex gap-3 items-end py-4 max-sm:justify-center">
          <h1 className="font-display text-3xl font-semibold">Events</h1>
          {(selectedCount || totalCount) && (
            <span className="text-xl text-neutral-600 dark:text-neutral-400">
              ({selectedCount}
              {selectedCount ? (totalCount ? ' out of ' : ' selected') : ''}
              {totalCount})
            </span>
          )}
        </div>
        <div className="flex items-center justify-between grow max-sm:mx-4">
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            className="[&_.MuiTab-root]:min-h-14"
          >
            <Tab
              label="Search"
              icon={<SearchIcon />}
              iconPosition="start"
              LinkComponent={Link}
              href="/events"
            />
            <Tab
              label="Calendar"
              icon={<CalendarMonthIcon />}
              iconPosition="start"
              // disabled
              LinkComponent={Link}
              href="/events/calendar"
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
};
export default EventsTitle;
