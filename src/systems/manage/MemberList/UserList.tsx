'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { SelectUserMetadataWithUser } from '@/server/db/models';
import ListGrid from './ListGrid';

type UserListProps = {
  users: SelectUserMetadataWithUser[];
  columns: GridColDef[];
};

const UserList = ({ users, columns }: UserListProps) => {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-8">
      <ListGrid
        rows={users}
        columns={columns}
        checkboxSelection
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
      />
    </div>
  );
};

export default UserList;
