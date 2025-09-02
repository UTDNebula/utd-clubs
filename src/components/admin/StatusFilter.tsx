import { type Column, type Table } from '@tanstack/react-table';
import { useState } from 'react';

type Props<T> = {
  column: Column<T, unknown>;
  table: Table<T>;
};

export default function StatusFilter<T>({ column }: Props<T>) {
  const columnFilterValue = column.getFilterValue() as
    | 'approved'
    | 'rejected'
    | 'pending'
    | null;

  const [value, setValue] = useState(columnFilterValue ?? '');

  function updateFilterValue(value: string) {
    switch (value) {
      case 'approved':
        setValue('approved');
        column.setFilterValue('approved');
        break;
      case 'rejected':
        setValue('rejected');
        column.setFilterValue('rejected');
        break;
      case 'pending':
        setValue('pending');
        column.setFilterValue('pending');
        break;
      default:
        setValue('All');
        column.setFilterValue(null);
    }
  }

  return (
    <select
      value={value}
      onChange={(e) => updateFilterValue(e.target.value)}
      className="rounded-sm border shadow-sm"
    >
      <option value="All">All</option>
      <option value="approved">Approved</option>
      <option value="pending">Pending</option>
      <option value="rejected">Rejected</option>
    </select>
  );
}
