import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Chip from '@mui/material/Chip';
import { GridColDef } from '@mui/x-data-grid';
import { TRPCClientErrorLike } from '@trpc/client';
import { ReactNode } from 'react';
import { AppRouter } from '@src/server/api/root';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';
import getFormattedListString from '@src/utils/getFormattedListString';
import {
  ActionsCell,
  ContactEmailCell,
  MemberTypeCell,
} from './CustomRenderCell';

export function getFormattedUserListString(
  users?:
    | SelectUserMetadataToClubsWithUserMetadata
    | SelectUserMetadataToClubsWithUserMetadata[],
): string {
  if (users === undefined) return 'unknown user(s)';

  const normalizedUsers = Array.isArray(users) ? users : [users];

  return getFormattedListString(
    normalizedUsers.map((ele) => ele.userMetadata?.firstName ?? ''),
    {
      maxSpecified: 1,
      oxfordComma: true,
      termString: { singular: 'person', plural: 'people' },
    },
  );
}

type ColumnHeaderWithIconProps = {
  icon: ReactNode;
  children: ReactNode;
};

export const ColumnHeaderWithIcon = ({
  icon,
  children,
}: ColumnHeaderWithIconProps) => (
  <span className="flex gap-1 items-center">
    <div className="flex justify-center items-center text-gray-600 h-4 *:w-4 *:h-4">
      {icon}
    </div>
    <div className="font-[var(--unstable_DataGrid-headWeight)]">{children}</div>
  </span>
);

export type MemberListAbilities = {
  removeUsers?: boolean;
  refresh?: boolean;
  downloadCSV?: boolean;
  viewAccountEmail?: boolean;
};

export type ToastState = {
  open: boolean;
  type?: 'success' | 'error';
  string?: string;
  error?: TRPCClientErrorLike<AppRouter>;
};

export const columns: GridColDef<SelectUserMetadataToClubsWithUserMetadata>[] =
  [
    {
      field: 'firstName',
      valueGetter: (_value, row) => {
        return row.userMetadata?.firstName;
      },
      headerName: 'First Name',
      width: 130,
    },
    {
      field: 'lastName',
      valueGetter: (value, row) => {
        return row.userMetadata?.lastName;
      },
      headerName: 'Last Name',
      width: 130,
    },
    {
      field: 'year',
      valueGetter: (_value, row) => {
        return row.userMetadata?.year;
      },
      headerName: 'Year',
      renderHeader: (params) => (
        <ColumnHeaderWithIcon icon={<CalendarMonthOutlinedIcon />}>
          {params.colDef.headerName}
        </ColumnHeaderWithIcon>
      ),
      width: 140,
      renderCell: (params) => {
        if (!params.value) return;
        return <Chip label={params.value} />;
      },
    },
    {
      field: 'major',
      valueGetter: (_value, row) => {
        return row.userMetadata?.major;
      },
      headerName: 'Major',
      renderHeader: (params) => (
        <ColumnHeaderWithIcon icon={<SchoolOutlinedIcon />}>
          {params.colDef.headerName}
        </ColumnHeaderWithIcon>
      ),
      width: 230,
      renderCell: (params) => {
        if (!params.value) return;
        return <Chip label={params.value} />;
      },
    },
    {
      field: 'minor',
      valueGetter: (_value, row) => {
        return row.userMetadata?.minor;
      },
      headerName: 'Minor',
      width: 230,
      renderCell: (params) => {
        if (!params.value) return;
        return <Chip label={params.value} />;
      },
    },
    {
      field: 'contactEmail',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      valueGetter: (_value, row) => {
        return 'placeholder@utdallas.edu';
      },
      headerName: 'Contact Email',
      renderHeader: (params) => (
        <ColumnHeaderWithIcon icon={<EmailOutlinedIcon />}>
          {params.colDef.headerName}
        </ColumnHeaderWithIcon>
      ),
      width: 280,
      renderCell: (params) => <ContactEmailCell {...params} />,
      cellClassName: 'pl-1.5',
    },
    {
      field: 'memberType',
      valueGetter: (value) => {
        switch (value) {
          case 'President':
            return 'Admin';
          case 'Officer':
            return 'Collaborator';
          default:
            return value;
        }
      },
      headerName: 'Role',
      renderHeader: (params) => (
        <ColumnHeaderWithIcon icon={<PersonOutlinedIcon />}>
          {params.colDef.headerName}
        </ColumnHeaderWithIcon>
      ),
      width: 140,
      renderCell: (params) => <MemberTypeCell {...params} />,
    },
    { field: 'userId', headerName: 'ID', width: 360 },
  ];

export const actionColumn: GridColDef<SelectUserMetadataToClubsWithUserMetadata> =
  {
    field: 'actions',
    type: 'actions',
    width: 40,
    renderCell: (params) => <ActionsCell {...params} />,
    resizable: false,
  };
