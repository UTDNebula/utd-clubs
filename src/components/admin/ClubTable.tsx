'use client';

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { RouterOutputs } from '@src/trpc/shared';
import { fuzzyFilter } from '@src/utils/table';
import { ClubTags } from '../common/ClubTags';
import Filter from './Filter';
import StatusFilter from './StatusFilter';

export default function ClubTable({
  clubs,
}: {
  clubs: RouterOutputs['admin']['allClubs'];
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<
    ColumnDef<RouterOutputs['admin']['allClubs'][number]>[]
  >(
    () => [
      {
        id: 'view',
        cell: ({ row }) => (
          <Link
            href={`/admin/clubs/${row.original.slug}`}
            className="inline-block"
          >
            <Button variant="contained" className="normal-case" size="small">
              View
            </Button>
          </Link>
        ),
        size: 84,
      },
      {
        accessorKey: 'name',
        cell: (info) => info.getValue(),
        sortingFn: (a, b) => a.original.name.localeCompare(b.original.name),
        filterFn: fuzzyFilter,
        enableColumnFilter: true,
        header: () => 'Name',
        size: 300,
      },
      {
        accessorKey: 'tags',
        cell: (info) => {
          const tags = info.getValue() as string[];
          return (
            <div className="flex flex-wrap gap-1">
              <ClubTags tags={tags} size="small" />
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
        size: 300,
      },
      {
        id: 'status',
        filterFn: 'equals',
        accessorFn: (row) => row.approved,
        cell: ({ row }) => {
          const approved = row.original.approved;
          const color =
            approved === 'pending'
              ? 'bg-yellow-500'
              : approved === 'approved'
                ? 'bg-green-500'
                : 'bg-red-500';

          return (
            <div className="flex justify-center">
              <div className={`h-3 w-3 rounded-full ${color}`} />
            </div>
          );
        },
        header: () => 'Status',
        size: 96,
      },
      {
        accessorKey: 'soc',
        enableColumnFilter: false,
        header: () => 'From SOC',
        cell: (info) => (
          <div className="flex justify-center">
            <div
              className={`h-3 w-3 rounded-full ${
                info.getValue() ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </div>
        ),
        size: 64,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: clubs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  });

  return (
    <div ref={parentRef} className="w-full max-w-6xl">
      <TableContainer component={Paper}>
        <Table
          className="w-full text-left text-sm text-gray-500"
          sx={{ tableLayout: 'fixed' }}
        >
          <TableHead className="bg-slate-100 text-xs text-slate-700 uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex flex-col items-center text-center">
                          <div>
                            {header.column.getCanSort() ? (
                              <TableSortLabel
                                active={header.column.getIsSorted() !== false}
                                direction={
                                  header.column.getIsSorted() || undefined
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </TableSortLabel>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            )}
                          </div>
                          {header.column.getCanFilter() &&
                            (header.column.id !== 'status' ? (
                              <Filter column={header.column} table={table} />
                            ) : (
                              <StatusFilter
                                column={header.column}
                                table={table}
                              />
                            ))}
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<
                RouterOutputs['admin']['allClubs'][number]
              >;
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    //console.log(cell);
                    return (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
