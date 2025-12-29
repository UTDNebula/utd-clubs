import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Chip from '@mui/material/Chip';
import { GridColDef } from '@mui/x-data-grid';
import { TRPCClientErrorLike } from '@trpc/client';
import Image, { ImageProps } from 'next/image';
import { ReactNode, useState } from 'react';
import { AppRouter } from '@src/server/api/root';
import {
  SelectUserMetadataToClubsWithUserMetadata,
  SelectUserMetadataToClubsWithUserMetadataWithUser,
} from '@src/server/db/models';
import formatListString from '@src/utils/formatListString';
import {
  ActionsCell,
  ContactEmailCell,
  MemberTypeCell,
} from './CustomRenderCell';

/**
 * Wrapper function for {@linkcode formatListString()} that takes in a list of users and returns the users' first names formatted as a list.
 * @param {SelectUserMetadataToClubsWithUserMetadata | SelectUserMetadataToClubsWithUserMetadata[]} users - Array of users to be formatted (required)
 * @returns {string} Formatted string
 */
export function formatUserListString(
  users?:
    | SelectUserMetadataToClubsWithUserMetadata
    | SelectUserMetadataToClubsWithUserMetadata[],
): string {
  if (users === undefined) return 'unknown user(s)';

  const normalizedUsers = Array.isArray(users) ? users : [users];

  return formatListString(
    normalizedUsers.map((ele) => ele.userMetadata?.firstName ?? ''),
    {
      maxSpecified: 1,
      oxfordComma: true,
      termString: { singular: 'person', plural: 'people' },
      conjunction: 'and',
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
    {/* Matches font weight of header text to default font weight of MUI Data Grid headers */}
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

const AvatarImage = ({
  src,
  initial,
  alt,
  ...props
}: ImageProps & { initial: string }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    // Fallback to first initial if no image
    return (
      <div className="flex h-10 w-10 items-center justify-center bg-slate-200 text-slate-500 text-sm font-bold rounded-full">
        {initial}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full object-cover object-left z-10"
      onLoad={() => setImageError(false)}
      onError={() => setImageError(true)}
      {...props}
    />
  );
};

export const columns: GridColDef<SelectUserMetadataToClubsWithUserMetadataWithUser>[] =
  [
    {
      field: 'avatar',
      valueGetter: (_value, row) => {
        return row.userMetadata?.user?.image;
      },
      headerName: 'Avatar',
      renderHeader: () => '',
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      resizable: false,
      width: 60,
      renderCell: (params) => {
        return (
          <div className="flex items-center h-full">
            <AvatarImage
              src={params.value}
              alt={'Avatar'}
              initial={params.row.userMetadata?.firstName.charAt(0) ?? '?'}
            />
          </div>
        );
      },
    },
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
      valueGetter: (_value, row) => {
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
      width: 120,
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
      width: 190,
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
      width: 190,
      renderCell: (params) => {
        if (!params.value) return;
        return <Chip label={params.value} />;
      },
    },
    {
      field: 'accountEmail',
      valueGetter: (_value, row) => {
        return row.userMetadata?.user?.email;
      },
      headerName: 'Account Email',
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

export const actionColumn: GridColDef<SelectUserMetadataToClubsWithUserMetadataWithUser> =
  {
    field: 'actions',
    type: 'actions',
    width: 40,
    renderCell: (params) => <ActionsCell {...params} />,
    resizable: false,
  };
