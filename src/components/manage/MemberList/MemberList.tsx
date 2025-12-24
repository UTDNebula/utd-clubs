'use client';

import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
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
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import z from 'zod';
import Confirmation from '@src/components/Confirmation';
import { AppRouter } from '@src/server/api/root';
import { removeMembersSchema } from '@src/server/api/routers/clubEdit';
import {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadata,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';
import CustomFooter from './CustomFooter';
import CustomToolbar from './CustomToolbar';
import { MemberListContext, MemberListContextType } from './MemberListContext';
import useMemberListDeletionState from './useMemberListDeletionState';
import {
  actionColumn,
  columns,
  formatUserListString,
  MemberListAbilities,
  ToastState,
} from './utils';

type MemberListProps = {
  members: SelectUserMetadataToClubsWithUserMetadata[];
  club: SelectClub;
};

const MemberList = ({ members, club }: MemberListProps) => {
  const membersIndexed = members.map((member, index) => {
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

  // For row/member deletion
  const removeMembers = useMutation<
    void,
    TRPCClientErrorLike<AppRouter>,
    z.infer<typeof removeMembersSchema>
  >(api.club.edit.removeMembers.mutationOptions({}));

  // For refresh button
  const getMembers = useQuery(
    api.club.getMembers.queryOptions({ id: club.id }, { enabled: false }),
  );

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
   * Contact emails visibility
   */

  const [contactEmailsVisible, showContactEmails] = useState<boolean>(false);

  const handleOnCellDoubleClick: GridEventListener<'cellDoubleClick'> = (
    params,
  ) => {
    if (params.colDef.field == 'contactEmail' && !contactEmailsVisible) {
      showContactEmails(true);
    }
  };

  /*
   * Toast
   */

  const [toastState, setToastState] = useState<ToastState>({
    open: false,
  });

  const handleCloseToast = useCallback(
    (event: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === 'clickaway') {
        return;
      }

      setToastState({ ...toastState, open: false });
    },
    [toastState],
  );

  /*
   * Row/Member Deletion
   */

  const memberListDeletionState = useMemberListDeletionState(
    rows,
    rowSelectionModel,
  );

  const {
    deleteUsers,
    deleteSourceModel,
    openConfirmDialog,
    setOpenConfirmDialog,
  } = memberListDeletionState;

  const deleteRows = useCallback((rowId: GridRowId | GridRowId[]) => {
    const normalizedGridRowIds = Array.isArray(rowId) ? rowId : [rowId];
    setRows((prevRows) =>
      prevRows.filter((row) => !normalizedGridRowIds.includes(row.id)),
    );
  }, []);

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
        onSuccess: () => {
          if (deleteSourceModel.source === 'selection') {
            deleteRows([...rowSelectionModel.ids]);
          } else {
            deleteRows(deleteSourceModel.rowId!);
          }
          setToastState({
            open: true,
            type: 'success',
            string: `Successfully removed ${userListString}!`,
          });
        },
        onError: (error) => {
          setToastState({
            open: true,
            type: 'error',
            string: `Couldn't remove ${userListString}!`,
            error: error,
          });
        },
      },
    );
  }, [
    handleCloseDialog,
    deleteSourceModel.rowId,
    deleteSourceModel.source,
    deleteUsers,
    removeMembers,
    club.id,
    deleteRows,
    rowSelectionModel.ids,
  ]);

  /*
   * Refresh button
   */

  const refreshList = useCallback(async () => {
    if (getMembers.isFetching) return;
    await getMembers.refetch().then((data) => {
      if (data.data) {
        setRows(
          data.data.map((member, index) => {
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
        <Snackbar
          open={toastState.open}
          autoHideDuration={6000}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={handleCloseToast}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toastState.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            <p>{toastState.string}</p>
            {toastState.type === 'error' && toastState.error && (
              <p>Reason: {toastState.error.message}</p>
            )}
          </Alert>
        </Snackbar>
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
            columns: { columnVisibilityModel: { userId: false, minor: false } },
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
