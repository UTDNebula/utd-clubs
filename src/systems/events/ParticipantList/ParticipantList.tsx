'use client';

import { GridRowId, GridRowSelectionModel, GridSlots } from '@mui/x-data-grid';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Confirmation from '@/lib/components/Confirmation';
import { useSnackbar } from '@/lib/modules/snackbar';
import type {
  SelectEvent,
  SelectUserMetadataToEventsWithUserMetadataWithUser,
} from '@/server/db/models';
import ListGrid from '@/systems/manage/MemberList/ListGrid';
import { useTRPC } from '@/trpc/react';
import CustomToolbar from './CustomToolbar';
import { ParticipantListContext } from './ParticipantListContex';
import { columns } from './utils';

type ParticipantListProps = {
  participants: SelectUserMetadataToEventsWithUserMetadataWithUser[];
  event: SelectEvent;
};

const ParticipantList = ({ participants, event }: ParticipantListProps) => {
  const [rows, setRows] = useState(
    participants.map((participant) => ({
      ...participant,
      id: participant.userId,
    })),
  );

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: 'include',
      ids: new Set<GridRowId>(),
    });

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const api = useTRPC();
  const { setSnackbar } = useSnackbar();

  const removeParticipants = useMutation(
    api.event.manage.removeParticipants.mutationOptions(),
  );

  const selectedIds = rows
    .filter((row) => rowSelectionModel.ids.has(row.id))
    .map((row) => row.userId);

  const handleConfirmDelete = async () => {
    try {
      await removeParticipants.mutateAsync({
        eventId: event.id,
        ids: selectedIds,
      });

      setRows((currentRows) =>
        currentRows.filter((row) => !selectedIds.includes(row.userId)),
      );

      setRowSelectionModel({
        type: 'include',
        ids: new Set<GridRowId>(),
      });

      setSnackbar({
        type: 'success',
        message: `Successfully removed ${selectedIds.length} registration${selectedIds.length === 1 ? '' : 's'}.`,
        autoHideDuration: true,
      });
    } catch (error) {
      setSnackbar({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Could not remove registrations.',
        autoHideDuration: false,
        showClose: true,
      });
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  return (
    <div className="flex w-full max-w-6xl flex-col gap-4">
      <ParticipantListContext.Provider
        value={{ openConfirmDialog: setOpenConfirmDialog }}
      >
        <ListGrid
          rows={rows}
          columns={columns}
          toolbar={CustomToolbar as GridSlots['toolbar']}
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
        />
      </ParticipantListContext.Provider>

      <Confirmation
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        title={`Remove ${selectedIds.length} registration${selectedIds.length === 1 ? '' : 's'}?`}
        contentText="This will unregister the selected participants from this event. Their accounts and club memberships will not be affected."
        confirmText="Remove"
        loading={removeParticipants.isPending}
      />
    </div>
  );
};

export default ParticipantList;
