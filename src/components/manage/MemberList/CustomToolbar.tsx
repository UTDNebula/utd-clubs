import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  ColumnsPanelTrigger,
  ExportCsv,
  FilterPanelTrigger,
  gridRowSelectionCountSelector,
  GridSlots,
  PropsFromSlot,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useContext, useRef, useState } from 'react';
import { SelectClub } from '@src/server/db/models';
import { MemberListContext } from './MemberListContext';

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
}));

// In order to add custom props to the custom MUI toolbar component,
// we need to extend the `PropsFromSlot<GridSlots['toolbar']>` interface.
// Documentation: https://mui.com/x/common-concepts/custom-components/#using-additional-props
interface CustomToolbarProps extends PropsFromSlot<GridSlots['toolbar']> {
  club: SelectClub;
}

export default function CustomToolbar({ club }: CustomToolbarProps) {
  const {
    memberListDeletionState,
    memberListAbilities,
    refreshList,
    rowSelectionModel,
    selfRowId,
  } = useContext(MemberListContext);

  const apiRef = useGridApiContext();
  const selectedRowCount = useGridSelector(
    apiRef,
    gridRowSelectionCountSelector,
  );

  const selfSelected =
    selfRowId !== undefined ? rowSelectionModel.ids.has(selfRowId) : false;

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Toolbar
      className={`${selectedRowCount ? 'bg-[var(--DataGrid-t-color-interactive-selected)]/8' : ''}`}
    >
      <div className="grow-1 ml-2 shrink-1 max-w-full overflow-hidden whitespace-nowrap">
        {selectedRowCount ? (
          <div className="flex items-center gap-2 shrink-1">
            <span>{`Selection (${selectedRowCount} ${selectedRowCount == 1 ? 'person' : 'people'})`}</span>
            <div>
              {memberListAbilities.removeUsers && (
                <Tooltip
                  title={
                    selfSelected ? (
                      <div className="text-center">
                        You cannot remove yourself
                        <br />
                        Another admin must remove you
                      </div>
                    ) : (
                      'Remove Selected'
                    )
                  }
                >
                  {/* This span is required to ensure the error tooltip shows when the IconButton is disabled */}
                  <span>
                    <ToolbarButton
                      onClick={() => {
                        memberListDeletionState?.deleteSourceModel.setFromSelection();
                        memberListDeletionState?.setOpenConfirmDialog(true);
                      }}
                      disabled={selfSelected}
                    >
                      <DeleteIcon fontSize="small" />
                    </ToolbarButton>
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        ) : (
          <Typography
            variant="h2"
            className="text-base font-semibold text-haiti"
          >
            <span className="hidden sm:inline">
              {'Club Members' + (club ? ' for ' + club.name : '')}
            </span>
            <span className="inline sm:hidden">Club Members</span>
          </Typography>
        )}
      </div>

      {memberListAbilities.refresh && (
        <Tooltip title="Refresh" className="max-sm:hidden">
          <ToolbarButton onClick={refreshList}>
            <RefreshIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      )}

      {memberListAbilities.downloadCSV && (
        <Tooltip title="Export" className="max-sm:hidden">
          <ToolbarButton
            ref={exportMenuTriggerRef}
            id="export-menu-trigger"
            aria-controls="export-menu"
            aria-haspopup="true"
            aria-expanded={exportMenuOpen ? 'true' : undefined}
            onClick={() => setExportMenuOpen(true)}
          >
            <FileDownloadOutlinedIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      )}

      {memberListAbilities.refresh && memberListAbilities.downloadCSV && (
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ mx: 0.5 }}
          className="max-sm:hidden"
        />
      )}

      <Tooltip title="Columns" className="max-sm:hidden">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnOutlinedIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters" className="max-sm:hidden">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge
                badgeContent={state.filterCount}
                color="primary"
                variant="dot"
              >
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={exportMenuTriggerRef.current}
        open={exportMenuOpen}
        onClose={() => setExportMenuOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: {
            'aria-labelledby': 'export-menu-trigger',
          },
        }}
      >
        {memberListAbilities.downloadCSV && (
          <ExportCsv
            render={<MenuItem />}
            onClick={() => setExportMenuOpen(false)}
          >
            Download as CSV
          </ExportCsv>
        )}
      </Menu>

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ mx: 0.5 }}
        className="max-sm:hidden"
      />

      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}
