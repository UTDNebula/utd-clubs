import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { createContext } from 'react';
import z from 'zod';
import { AppRouter } from '@src/server/api/root';
import { removeMembersSchema } from '@src/server/api/routers/clubEdit';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';
import useMemberListDeletionState from './useMemberListDeletionState';
import { MemberListAbilities } from './utils';

// TODO: Possible remove usused: rowSelectionModel
export interface MemberListContextType {
  memberListDeletionState:
    | ReturnType<typeof useMemberListDeletionState>
    | undefined;
  memberListAbilities: MemberListAbilities;
  contactEmailsVisible: boolean;
  showContactEmails: (visibility: boolean) => void;
  removeMembers:
    | UseMutationResult<
        void,
        TRPCClientErrorLike<AppRouter>,
        z.infer<typeof removeMembersSchema>
      >
    | undefined;
  getMembers:
    | UseQueryResult<
        z.infer<SelectUserMetadataToClubsWithUserMetadata>,
        TRPCClientErrorLike<AppRouter>
      >
    | undefined;
  refreshList: () => void;
  rowSelectionModel: GridRowSelectionModel;
  selfRowId: GridRowId | undefined;
}

export const MemberListContext = createContext<MemberListContextType>({
  memberListDeletionState: undefined,
  memberListAbilities: {
    removeUsers: false,
    downloadCSV: true,
    viewAccountEmail: true,
  },
  contactEmailsVisible: false,
  showContactEmails: () => {},
  removeMembers: undefined,
  getMembers: undefined,
  refreshList: () => {},
  rowSelectionModel: {
    type: 'include',
    ids: new Set<GridRowId>(),
  },
  selfRowId: undefined,
});
