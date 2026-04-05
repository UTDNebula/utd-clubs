import GridViewIcon from '@mui/icons-material/GridView';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SortIcon from '@mui/icons-material/Sort';
import { memo } from 'react';
import { EventCardVariants } from '@src/components/events/EventCard';
import { EventFiltersSchema, sortEnum } from '@src/utils/eventFilter';
import { setEventsParams } from './utils';
import CompactPagination from './view/CompactPagination';
import ViewOption, { ViewOptionItem } from './view/ViewOptionItem';

type EventsViewOptionsBarProps = {
  filters: EventFiltersSchema;
  /**
   * The total number of pages.
   * @default 1
   */
  pageCount?: number;
  viewValue?: EventCardVariants;
  defaultViewValue?: EventCardVariants;
  onChangeView?: (value: EventCardVariants) => void;
};

export default memo(function EventsViewOptionsBar({
  filters,
  pageCount,
  viewValue,
  defaultViewValue,
  onChangeView,
}: EventsViewOptionsBarProps) {
  const handleChangePage = (newValue: number) => {
    setEventsParams((params) => {
      if (newValue !== 0) {
        params.set('page', String(newValue + 1));
      } else {
        params.delete('page');
      }
    });
  };

  const handleChangeSort = (newValue?: (typeof sortEnum.options)[number]) => {
    setEventsParams((params) => {
      if (newValue && newValue !== 'upcoming') {
        params.set('s', newValue);
      } else {
        params.delete('s');
      }
    });
  };

  const handleChangeView = (newValue?: EventCardVariants) => {
    if (newValue) {
      onChangeView?.(newValue);
    }
  };

  const handleChangeSize = (newValue?: number) => {
    setEventsParams((params) => {
      // Go back to first page if page size changes
      if (newValue !== Number(params.get('size'))) {
        params.delete('page');
      }
      if (newValue && newValue !== 20) {
        params.set('size', String(newValue));
      } else {
        params.delete('size');
      }
    });
  };

  // If past and no custom date, sort by recency
  const sortByRecency =
    filters.past && !filters.date && !filters.dateStart && !filters.dateEnd;

  const sortOptions: ViewOptionItem<(typeof sortEnum.options)[number]>[] = [
    { label: sortByRecency ? 'Recent' : 'Upcoming', value: 'upcoming' },
    { label: 'Updated', value: 'updated' },
  ];

  const viewOptions: ViewOptionItem<EventCardVariants>[] = [
    { label: 'List', value: 'list', icon: <ListAltIcon /> },
    { label: 'Gallery', value: 'card', icon: <GridViewIcon /> },
  ];

  const sizeOptions: ViewOptionItem<number>[] = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 text-neutral-600 dark:text-neutral-400">
        <ViewOption
          title="Sort"
          icon={<SortIcon />}
          labelContents="value"
          defaultValue="upcoming"
          options={sortOptions}
          value={filters.sort}
          onChange={handleChangeSort}
        />
        <ViewOption
          title="View"
          iconOnly
          icon={<GridViewIcon />}
          options={viewOptions}
          defaultValue={defaultViewValue ?? 'card'}
          type="cycle"
          value={viewValue}
          onChange={handleChangeView}
        />
        <div className="max-sm:hidden">
          <ViewOption
            title="Count"
            options={sizeOptions}
            defaultValue={20}
            value={filters.size}
            onChange={handleChangeSize}
          />
        </div>
      </div>
      <CompactPagination
        count={pageCount}
        page={filters.page - 1}
        onChange={handleChangePage}
      />
    </div>
  );
});
