import type { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import type { SelectUserMetadataToEventsWithUserMetadataWithUser } from '@/server/db/models';

type ParticipantRow = SelectUserMetadataToEventsWithUserMetadataWithUser & {
  id: string;
};

type DeleteSource = 'rowId' | 'selection' | undefined;

type DeleteSourceModel = {
  rowId: GridRowId | null;
  source: DeleteSource;
  setFromRowId: (rowId: GridRowId) => void;
  setFromSelection: () => void;
  unset: () => void;
};

export default function useParticipantListDeletionState(
  rows: ParticipantRow[],
  rowSelectionModel: GridRowSelectionModel,
) {
  const [deleteParticipants, setDeleteParticipants] = useState<
    | SelectUserMetadataToEventsWithUserMetadataWithUser
    | SelectUserMetadataToEventsWithUserMetadataWithUser[]
    | undefined
  >();

  const [rowId, setRowId] = useState<GridRowId | null>(null);
  const [source, setSource] = useState<DeleteSource>();

  const updateDeleteParticipants = useCallback(() => {
    setDeleteParticipants(
      source === 'selection'
        ? rows.filter((row) => rowSelectionModel.ids.has(row.id))
        : rows.find((row) => row.id === rowId),
    );
  }, [rowId, rowSelectionModel.ids, rows, source]);

  const setFromRowId = useCallback(
    (rowId: GridRowId) => {
      setRowId(rowId);
      setSource('rowId');
      setDeleteParticipants(rows.find((row) => row.id === rowId));
    },
    [rows],
  );

  const setFromSelection = useCallback(() => {
    setSource('selection');
    setDeleteParticipants(
      rows.filter((row) => rowSelectionModel.ids.has(row.id)),
    );
  }, [rowSelectionModel.ids, rows]);

  const unset = useCallback(() => {
    setRowId(null);
    setSource(undefined);
    setDeleteParticipants(undefined);
  }, []);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const deleteSourceModel: DeleteSourceModel = {
    rowId,
    source,
    setFromRowId,
    setFromSelection,
    unset,
  };

  return {
    deleteParticipants,
    updateDeleteParticipants,
    deleteSourceModel,
    openConfirmDialog,
    setOpenConfirmDialog,
  };
}
