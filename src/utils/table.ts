import { rankItem } from '@tanstack/match-sorter-utils';
import { type FilterFn } from '@tanstack/react-table';
import { type SelectClub } from '@src/server/db/models';

export type Club = Omit<
  SelectClub,
  'description' | 'image' | 'pageViews' | 'updatedAt' | 'bannerImage'
>;

export const fuzzyFilter: FilterFn<Club> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value as string);
  addMeta({ itemRank });
  return itemRank.passed;
};
