'use client';

import { DataGrid, GridColDef, Toolbar } from '@mui/x-data-grid';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';

type MemberListProps = {
  members: SelectUserMetadataToClubsWithUserMetadata[];
};

const MemberList = ({ members }: MemberListProps) => {
  const columns: GridColDef[] = [
    // {
    //   field: 'userMetadata',
    //   valueGetter: (value: SelectUserMetadata) =>
    //     `${value.firstName} ${value.firstName}`,
    //   headerName: 'Full Name',
    //   width: 120,
    // },
    // {
    //   field: 'fullName',
    //   valueGetter: (_value, row) =>
    //     `${row.userMetadata.firstName} ${row.userMetadata.lastName}`,
    //   headerName: 'Full Name',
    //   width: 120,
    // },
    {
      field: 'firstName',
      valueGetter: (_value, row) => {
        return row.userMetadata.firstName;
      },
      headerName: 'First Name',
      width: 130,
    },
    {
      field: 'lastName',
      valueGetter: (value, row) => {
        return row.userMetadata.lastName;
      },
      headerName: 'Last Name',
      width: 130,
    },
    {
      field: 'year',
      valueGetter: (_value, row) => {
        return row.userMetadata.year;
      },
      headerName: 'Year',
      width: 100,
    },
    {
      field: 'major',
      valueGetter: (_value, row) => {
        return row.userMetadata.major;
      },
      headerName: 'Major',
      width: 240,
    },
    { field: 'memberType', headerName: 'Role', width: 100 },
    { field: 'userId', headerName: 'ID', width: 360 },
  ];

  const membersIndexed = members.map((member, index) => {
    return {
      ...member,
      id: index,
    };
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <DataGrid
        rows={membersIndexed}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        initialState={{
          columns: { columnVisibilityModel: { userId: false } },
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        pageSizeOptions={[25]}
        checkboxSelection
        disableRowSelectionOnClick
        className="rounded-lg"
      />
    </div>
  );
};

export default MemberList;

const CustomToolbar = () => {
  return <Toolbar></Toolbar>;
};
