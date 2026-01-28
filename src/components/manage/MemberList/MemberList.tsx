'use client';

import {
  DataGrid,
  GridEventListener,
  GridRowId,
  GridRowSelectionModel,
  GridSlotProps,
  GridSlots,
} from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import z from 'zod';
import Confirmation from '@src/components/Confirmation';
import { AppRouter } from '@src/server/api/root';
import { removeMembersSchema } from '@src/server/api/routers/clubEdit';
import {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadataWithUser,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';
import { useSnackbar } from '@src/utils/Snackbar';
import CustomFooter from './CustomFooter';
import CustomToolbar from './CustomToolbar';
import { MemberListContext, MemberListContextType } from './MemberListContext';
import useMemberListDeletionState from './useMemberListDeletionState';
import {
  actionColumn,
  columns,
  defaultUserSort,
  formatUserListString,
  MemberListAbilities,
} from './utils';

type MemberListProps = {
  members: SelectUserMetadataToClubsWithUserMetadataWithUser[];
  club: SelectClub;
};

const MemberList = ({ members, club }: MemberListProps) => {
  const membersIndexed = members.sort(defaultUserSort).map((member, index) => {
    return {
      ...member,
      id: index,
    };
  });

  /**
   * Hooks and API
   */
  const session = authClient.useSession();

  const api = useTRPC();

  const removeMembers = useMutation<
    SelectUserMetadataToClubsWithUserMetadataWithUser[],
    TRPCClientErrorLike<AppRouter>,
    z.infer<typeof removeMembersSchema>
  >(api.club.edit.removeMembers.mutationOptions({}));

  // For refresh button
  const getMembers = useQuery(
    api.club.getMembers.queryOptions({ id: club.id }, { enabled: false }),
  );

  const { setSnackbar } = useSnackbar();

  /*
   * DataGrid controlled component props
   */

  const [rows, setRows] = useState<typeof membersIndexed>(membersIndexed);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: 'include',
      ids: new Set<GridRowId>(),
    });

  /*
   * Join timestamp modifier key detection
   */

  const [expandTimestamps, setExpandTimestamps] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        setExpandTimestamps(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey || !event.shiftKey) {
        setExpandTimestamps(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  /*
   * Contact emails visibility
   */

  const [contactEmailsVisible, showContactEmails] = useState<boolean>(false);

  const handleOnCellDoubleClick: GridEventListener<'cellDoubleClick'> = (
    params,
  ) => {
    if (params.colDef.field == 'accountEmail' && !contactEmailsVisible) {
      showContactEmails(true);
    }
  };

  /*
   * Row/Member Deletion
   */

  const memberListDeletionState = useMemberListDeletionState(
    rows,
    rowSelectionModel,
  );

  const { deleteUsers, openConfirmDialog, setOpenConfirmDialog } =
    memberListDeletionState;

  const handleCloseDialog = useCallback(() => {
    setOpenConfirmDialog(false);
  }, [setOpenConfirmDialog]);

  const handleConfirmDelete = useCallback(() => {
    const userListString = formatUserListString(deleteUsers);

    const targetUserIds = Array.isArray(deleteUsers)
      ? deleteUsers?.map((row) => row.userId)
      : deleteUsers?.userId;

    void removeMembers.mutateAsync(
      {
        clubId: club.id,
        ids: targetUserIds ?? '',
      },
      {
        onSettled: () => {
          handleCloseDialog();
        },
        onSuccess: (newMembers) => {
          setRows(
            newMembers.sort(defaultUserSort).map((member, index) => {
              const indexOG = membersIndexed.find(
                (oldMember) => oldMember.userId === member.userId,
              )?.id;

              return {
                ...member,
                id: indexOG ?? index,
              };
            }),
          );

          setSnackbar({
            type: 'success',
            message: `Successfully removed ${userListString}!`,
            autoHideDuration: true,
          });
        },
        onError: (error) => {
          setSnackbar({
            type: 'error',
            message: (
              <>
                {`Couldn't remove ${userListString}!`}
                <br />
                {`Reason: ${error.message}`}
              </>
            ),
            autoHideDuration: false,
            showClose: true,
          });
        },
      },
    );
  }, [
    deleteUsers,
    removeMembers,
    club.id,
    handleCloseDialog,
    setSnackbar,
    membersIndexed,
  ]);

  /*
   * Refresh button
   */

  const refreshList = useCallback(async () => {
    if (getMembers.isFetching) return;
    await getMembers.refetch().then((data) => {
      if (data.data) {
        setRows(
          data.data.sort(defaultUserSort).map((member, index) => {
            return {
              ...member,
              id: index,
            };
          }),
        );
      }
    });
  }, [getMembers]);

  /*
   * Abilities
   */

  const self = rows.find((row) => row.userId === session.data?.user.id);

  const isAdmin =
    rows.find((row) => row.userId === session.data?.user.id)?.memberType ===
    'President';

  const memberListAbilities: MemberListAbilities = useMemo(() => {
    return {
      removeUsers: isAdmin,
      refresh: true,
      downloadCSV: true,
      viewAccountEmail: true,
    };
  }, [isAdmin]);

  // Shows action column only if user is an admin
  const actionedColumns = isAdmin ? [...columns, actionColumn] : columns;

  /*
   * Context
   */

  const MemberListContextValues = useMemo<MemberListContextType>(
    () => ({
      memberListDeletionState,
      memberListAbilities,
      expandTimestamps,
      contactEmailsVisible,
      showContactEmails,
      removeMembers,
      getMembers,
      refreshList,
      rowSelectionModel,
      selfRowId: self?.id,
    }),
    [
      memberListDeletionState,
      memberListAbilities,
      expandTimestamps,
      contactEmailsVisible,
      removeMembers,
      getMembers,
      refreshList,
      rowSelectionModel,
      self?.id,
    ],
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <MemberListContext.Provider value={MemberListContextValues}>
        <DataGrid
          rows={rows}
          columns={actionedColumns}
          // MUI recommends type assertion for passing custom props to slots
          // Documentation: https://mui.com/x/common-concepts/custom-components/#using-additional-prop
          slots={{
            toolbar: CustomToolbar as GridSlots['toolbar'],
            footer: CustomFooter,
          }}
          slotProps={{ toolbar: { club: club } as GridSlotProps['toolbar'] }}
          showToolbar
          initialState={{
            columns: {
              columnVisibilityModel: {
                userId: false,
                major: false,
                minor: false,
              },
            },
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[25]}
          checkboxSelection
          disableRowSelectionOnClick
          disableRowSelectionExcludeModel
          className="rounded-lg"
          onCellDoubleClick={handleOnCellDoubleClick}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          hideFooterSelectedRowCount
        />
      </MemberListContext.Provider>
      <Confirmation
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title={`Remove ${formatUserListString(deleteUsers)}?`}
        contentText="This action cannot be undone."
        confirmText={`Remove${Array.isArray(deleteUsers) && deleteUsers.length > 1 ? ' All' : ''}`}
        loading={removeMembers.isPending}
      />
    </div>
  );
};

export default MemberList;
