import { FormControl, MenuItem, Select } from '@mui/material';
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

  const [value, setValue] = useState(columnFilterValue ?? 'All');

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
    <FormControl
      size="small"
      className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-haiti"
    >
      <Select
        value={value}
        onChange={(e) => updateFilterValue(e.target.value)}
        className="min-w-24 normal-case max-h-8 text-xs"
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="approved">Approved</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
      </Select>
    </FormControl>
  );
}
