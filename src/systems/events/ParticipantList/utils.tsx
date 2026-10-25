import type { GridColDef } from '@mui/x-data-grid';
import type { SelectUserMetadataToEventsWithUserMetadataWithUser } from '@/server/db/models';

export const columns: GridColDef<SelectUserMetadataToEventsWithUserMetadataWithUser>[] =
  [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      valueGetter: (_value, row) => row.userMetadata.firstName,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      valueGetter: (_value, row) => row.userMetadata.lastName,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      valueGetter: (_value, row) => row.userMetadata.user.email,
    },
    {
      field: 'registeredAt',
      headerName: 'Date Registered',
      flex: 1,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : '',
    },
  ];
