'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { type api } from '@src/trpc/server';
import RoleDropDown from './RoleDropDown';

type Officers = Awaited<ReturnType<typeof api.club.getOfficers>>;

const columns: ColumnDef<Officers[number]>[] = [
  {
    id: 'name',
    header: 'Full Name',
    accessorFn: (row) =>
      row.userMetadata.firstName + ' ' + row.userMetadata.lastName,
  },
  {
    id: 'role',
    header: 'Role',
    accessorFn: (row) => row.memberType,
    cell: RoleDropDown,
  },
];

export default function OfficerTable({ officers }: { officers: Officers }) {
  const table = useReactTable({
    data: officers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <table className="min-w-full divide-y divide-gray-200 overflow-hidden border-b border-gray-200 shadow-sm sm:rounded-lg">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
