import GridViewIcon from '@mui/icons-material/GridView';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SortIcon from '@mui/icons-material/Sort';
import { memo } from 'react';
import { EventFiltersSchema, sortEnum } from '@src/utils/eventFilter';
import { setParams } from './utils';
import CompactPagination from './view/CompactPagination';
import ViewOption, { ViewOptionItem } from './view/ViewOptionItem';

type EventsViewOptionsBarProps = {
  filters: EventFiltersSchema;
  /**
   * The total number of pages.
   * @default 1
   */
  pageCount?: number;
};

export default memo(function EventsViewOptionsBar({
  filters,
  pageCount,
}: EventsViewOptionsBarProps) {
  const handleChangePage = (newValue: number) => {
    setParams((params) => {
      if (newValue !== 0) {
        params.set('page', String(newValue + 1));
      } else {
        params.delete('page');
      }
    });
  };

  const handleChangeSort = (newValue?: (typeof sortEnum.options)[number]) => {
    setParams((params) => {
      if (newValue && newValue !== 'upcoming') {
        params.set('s', newValue);
      } else {
        params.delete('s');
      }
    });
  };

  const handleChangeSize = (newValue?: number) => {
    setParams((params) => {
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

  // TODO: Move elsewhere
  type ViewOptions = 'list' | 'gallery';

  const viewOptions: ViewOptionItem<ViewOptions>[] = [
    { label: 'List', value: 'list', icon: <ListAltIcon /> },
    { label: 'Gallery', value: 'gallery', icon: <GridViewIcon /> },
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
          defaultValue="gallery"
          type="cycle"
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
