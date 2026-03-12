import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';

type deleteSourceModelSources = 'rowId' | 'selection' | undefined;

type deleteSourceModelValues = {
  rowId: GridRowId | null;
  source: deleteSourceModelSources;
  setFromRowId: (rowId: GridRowId) => void;
  setFromSelection: () => void;
  unset: () => void;
};

export default function useUserListDeletionState(
  rows: (SelectUserMetadataToClubsWithUserMetadata & {
    id: number;
  })[],
  rowSelectionModel: GridRowSelectionModel,
) {
  const [deleteUsers, setDeleteUsers] = useState<
    | SelectUserMetadataToClubsWithUserMetadata
    | SelectUserMetadataToClubsWithUserMetadata[]
  >();

  const [rowId, setRowId] = useState<GridRowId | null>(null);

  const [source, setSource] = useState<deleteSourceModelSources>();

  const updateDeleteUsers = useCallback(() => {
    setDeleteUsers(
      source === 'selection'
        ? rows.filter((row) => rowSelectionModel.ids.has(row.id))
        : rows.find((row) => row.id == rowId),
    );
  }, [rowId, rowSelectionModel.ids, rows, source]);

  const setFromRowId = useCallback(
    (rowId: GridRowId) => {
      setRowId(rowId);
      setSource('rowId');
      setDeleteUsers(rows.find((row) => row.id == rowId));
    },
    [rows],
  );

  const setFromSelection = useCallback(() => {
    setSource('selection');
    setDeleteUsers(rows.filter((row) => rowSelectionModel.ids.has(row.id)));
  }, [rowSelectionModel.ids, rows]);

  const unset = useCallback(() => {
    setRowId(null);
    setSource(undefined);
  }, []);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const deleteSourceModelValue: deleteSourceModelValues = {
    rowId,
    source,
    setFromRowId,
    setFromSelection,
    unset,
  };

  return {
    deleteUsers,
    updateDeleteUsers,
    deleteSourceModel: deleteSourceModelValue,
    openConfirmDialog,
    setOpenConfirmDialog,
  };
}
