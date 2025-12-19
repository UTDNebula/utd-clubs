import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import React from 'react';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';

export type deleteSourceModelSources = 'rowId' | 'selection' | undefined;

export type deleteSourceModelValues = {
  rowId: GridRowId | null;
  source: deleteSourceModelSources;
  setFromRowId: (rowId: GridRowId) => void;
  setFromSelection: () => void;
  unset: () => void;
};

export default function useMemberListDeletionState(
  rows: (SelectUserMetadataToClubsWithUserMetadata & {
    id: number;
  })[],
  rowSelectionModel: GridRowSelectionModel,
) {
  const [deleteUsers, setDeleteUsers] = React.useState<
    | SelectUserMetadataToClubsWithUserMetadata
    | SelectUserMetadataToClubsWithUserMetadata[]
  >();

  const [rowId, setRowId] = React.useState<GridRowId | null>(null);

  const [source, setSource] = React.useState<deleteSourceModelSources>();

  const updateDeleteUsers = React.useCallback(() => {
    setDeleteUsers(
      source === 'selection'
        ? rows.filter((row) => rowSelectionModel.ids.has(row.id))
        : rows.find((row) => row.id == rowId),
    );
  }, [rowId, rowSelectionModel.ids, rows, source]);

  const setFromRowId = React.useCallback(
    (rowId: GridRowId) => {
      setRowId(rowId);
      setSource('rowId');
      setDeleteUsers(rows.find((row) => row.id == rowId));
    },
    [rows],
  );

  const setFromSelection = React.useCallback(() => {
    setSource('selection');
    setDeleteUsers(rows.filter((row) => rowSelectionModel.ids.has(row.id)));
  }, [rowSelectionModel.ids, rows]);

  const unset = React.useCallback(() => {
    setRowId(null);
    setSource(undefined);
  }, []);

  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

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
