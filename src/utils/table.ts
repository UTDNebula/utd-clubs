import { rankings, rankItem } from '@tanstack/match-sorter-utils';
import { type FilterFn } from '@tanstack/react-table';
import { RouterOutputs } from '@src/trpc/shared';

export const fuzzyFilter: FilterFn<
  RouterOutputs['admin']['allClubs'][number]
> = (row, columnId, value, addMeta) => {
  const nameRank = rankItem(row.getValue(columnId), value as string);
  const aliasRank = rankItem(row.original.alias ?? '', value as string);
  const itemRank = {
    ...nameRank,
    passed: nameRank.passed || aliasRank.passed,
    rank: nameRank.rank + 2 * aliasRank.rank,
  };
  addMeta({ itemRank });
  return itemRank.passed;
};
