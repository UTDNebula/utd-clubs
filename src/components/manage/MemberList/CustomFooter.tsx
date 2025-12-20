import CircularProgress from '@mui/material/CircularProgress';
import { GridFooter, GridFooterContainer } from '@mui/x-data-grid';
import { useContext } from 'react';
import { MemberListContext } from './MemberListContext';
import { getFormattedUserListString } from './utils';

export default function CustomFooter() {
  const { memberListDeletionState, removeMembers, getMembers } =
    useContext(MemberListContext);

  const loading = removeMembers?.isPending || getMembers?.isFetching;

  return (
    <GridFooterContainer>
      <div className="mx-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <CircularProgress color="inherit" size={20} />
            {removeMembers?.isPending && (
              <span>{`Removing ${getFormattedUserListString(memberListDeletionState?.deleteUsers)}`}</span>
            )}
            {getMembers?.isFetching && <span>Refreshing</span>}
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
