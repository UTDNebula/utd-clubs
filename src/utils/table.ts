import { rankItem } from '@tanstack/match-sorter-utils';
import { type FilterFn } from '@tanstack/react-table';
import { RouterOutputs } from '@src/trpc/shared';

export const fuzzyFilter: FilterFn<
  RouterOutputs['admin']['allClubs'][number]
> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value as string);
  addMeta({ itemRank });
  return itemRank.passed;
};
