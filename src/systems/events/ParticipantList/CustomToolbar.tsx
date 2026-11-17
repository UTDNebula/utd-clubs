import DeleteIcon from '@mui/icons-material/Delete';
import {
  gridRowSelectionCountSelector,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useContext } from 'react';
import { ParticipantListContext } from '@/systems/events/ParticipantList/ParticipantListContex';

export default function CustomToolbar() {
  const { openConfirmDialog } = useContext(ParticipantListContext);
  const apiRef = useGridApiContext();
  const selectedRowCount = useGridSelector(
    apiRef,
    gridRowSelectionCountSelector,
  );

  return (
    <Toolbar
      className={
        selectedRowCount
          ? 'bg-[var(--DataGrid-t-color-interactive-selected)]/8'
          : ''
      }
    >
      <div className="ml-2 max-w-full grow overflow-hidden whitespace-nowrap">
        {selectedRowCount ? (
          <div className="flex items-center gap-2">
            <span>{`Selection (${selectedRowCount} ${selectedRowCount === 1 ? 'person' : 'people'})`}</span>
            <ToolbarButton
              onClick={() => openConfirmDialog(true)}
              aria-label="Remove selected participants"
            >
              <DeleteIcon fontSize="small" />
            </ToolbarButton>
          </div>
        ) : (
          <span className="text-base font-semibold">Event Participants</span>
        )}
      </div>
    </Toolbar>
  );
}
