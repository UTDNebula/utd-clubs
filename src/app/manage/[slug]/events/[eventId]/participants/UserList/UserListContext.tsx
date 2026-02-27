import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { createContext } from 'react';
import z from 'zod';
import { AppRouter } from '@src/server/api/root';
import { joinLeaveSchema } from '@src/server/api/routers/event';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';
import useUserListDeletionState from './useUserListDeletionState';
import { UserListAbilities } from './utils';

export interface UserListContextType {
  userListDeletionState:
    | ReturnType<typeof useUserListDeletionState>
    | undefined;
  userListAbilities: UserListAbilities;
  expandTimestamps: boolean;
  contactEmailsVisible: boolean;
  showContactEmails: (visibility: boolean) => void;
  removeUsers:
    | UseMutationResult<
        SelectUserMetadataToClubsWithUserMetadata[],
        TRPCClientErrorLike<AppRouter>,
        z.infer<typeof joinLeaveSchema>
      >
    | undefined;
  getUsers:
    | UseQueryResult<
        z.infer<SelectUserMetadataToClubsWithUserMetadata>,
        TRPCClientErrorLike<AppRouter>
      >
    | undefined;
  refreshList: () => void;
  rowSelectionModel: GridRowSelectionModel;
  selfRowId: GridRowId | undefined;
}

export const UserListContext = createContext<UserListContextType>({
  userListDeletionState: undefined,
  userListAbilities: {
    removeUsers: false,
    downloadCSV: true,
    viewAccountEmail: true,
  },
  expandTimestamps: false,
  contactEmailsVisible: false,
  showContactEmails: () => {},
  removeUsers: undefined,
  getUsers: undefined,
  refreshList: () => {},
  rowSelectionModel: {
    type: 'include',
    ids: new Set<GridRowId>(),
  },
  selfRowId: undefined,
});
