import { type Column, type Table } from '@tanstack/react-table';
import DebouncedInput from './DebounceInput';

type Props<T> = {
  column: Column<T, unknown>;
  table: Table<T>;
};

export default function Filter<T>({ column, table }: Props<T>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <DebouncedInput
        type="number"
        slotProps={{
          input: {
            inputProps: {
              min: Number(column.getFacetedMinMaxValues()?.[0] ?? ''),
              max: Number(column.getFacetedMinMaxValues()?.[1] ?? ''),
            },
          },
        }}
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
        }`}
      />
      <DebouncedInput
        type="number"
        slotProps={{
          input: {
            inputProps: {
              min: Number(column.getFacetedMinMaxValues()?.[0] ?? ''),
              max: Number(column.getFacetedMinMaxValues()?.[1] ?? ''),
            },
          },
        }}
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
        }`}
      />
    </div>
  ) : (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search"
      />
    </>
  );
}
