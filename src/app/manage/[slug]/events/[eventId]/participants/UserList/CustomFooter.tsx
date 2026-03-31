import CircularProgress from '@mui/material/CircularProgress';
import { GridFooter, GridFooterContainer } from '@mui/x-data-grid';
import { useContext } from 'react';
import { UserListContext } from './UserListContext';
import { formatUserListString } from './utils';

export default function CustomFooter() {
  const { userListDeletionState, removeUsers, getUsers } =
    useContext(UserListContext);

  const loading = removeUsers?.isPending || getUsers?.isFetching;

  return (
    <GridFooterContainer>
      <div className="mx-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <CircularProgress color="inherit" size={20} />
            {removeUsers?.isPending && (
              <span>{`Removing ${formatUserListString(userListDeletionState?.deleteUsers)}`}</span>
            )}
            {getUsers?.isFetching && <span>Refreshing</span>}
          </div>
        ) : null}
      </div>
      <GridFooter
        sx={{
          border: 'none',
        }}
      />
    </GridFooterContainer>
  );
}
