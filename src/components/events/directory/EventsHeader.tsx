'use client';

// import RssFeedIcon from '@mui/icons-material/RssFeed';
// import SyncIcon from '@mui/icons-material/Sync';
// import Button from '@mui/material/Button';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import MenuItem from '@mui/material/MenuItem';
// import Tooltip from '@mui/material/Tooltip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '@src/components/common/PageHeader';
import { useEventDirectoryStore } from './filter/utils';

type EventsTitleProps = {
  selectedCount?: number;
  totalCount?: number;
};

export default function EventsHeader({
  selectedCount: selectedCountProp,
  totalCount: totalCountProp,
}: EventsTitleProps) {
  const selectedCountStore = useEventDirectoryStore(
    (state) => state.selectedCount,
  );
  const totalCountStore = useEventDirectoryStore((state) => state.totalCount);

  const selectedCount = selectedCountProp ?? selectedCountStore;
  const totalCount = totalCountProp ?? totalCountStore;

  const hasCount = selectedCount !== undefined || totalCount !== undefined;

  return (
    <PageHeader
      title="Events"
      metaText={
        hasCount
          ? `(${selectedCount}${
              selectedCount !== undefined
                ? totalCount !== undefined
                  ? ' out of '
                  : ' selected'
                : ''
            }${totalCount})`
          : undefined
      }
      tabs={[
        { label: 'Search', href: '/events', icon: <SearchIcon /> },
        {
          label: 'Calendar',
          href: '/events/calendar',
          icon: <CalendarMonthIcon />,
        },
      ]}
      // moreItems={[
      //   <MenuItem key="subscribe" disabled>
      //     <ListItemIcon>
      //       <RssFeedIcon />
      //     </ListItemIcon>
      //     <ListItemText>Subscribe</ListItemText>
      //   </MenuItem>,
      //   <MenuItem key="sync" disabled>
      //     <ListItemIcon>
      //       <SyncIcon />
      //     </ListItemIcon>
      //     <ListItemText>Sync</ListItemText>
      //   </MenuItem>,
      // ]}
      // slotProps={{ moreButton: { className: 'sm:hidden' } }}
    >
      {/* <Tooltip title="Coming soon">
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
      <Tooltip title="Coming soon">
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
      </Tooltip> */}
    </PageHeader>
  );
}
