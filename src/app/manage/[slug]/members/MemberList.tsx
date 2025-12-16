'use client';

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import GavelIcon from '@mui/icons-material/Gavel';
import HandymanIcon from '@mui/icons-material/Handyman';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Skeleton } from '@mui/material';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
  DataGrid,
  ExportCsv,
  // ExportPrint,
  FilterPanelTrigger,
  GridActionsCell,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowId,
  GridSlotProps,
  GridSlots,
  PropsFromSlot,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid';
import { ReactNode } from 'react';
import * as React from 'react';
import {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadata,
} from '@src/server/db/models';

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

interface MemberListHandlers {
  toggleAdmin: (id: GridRowId) => void;
  deleteUser: (id: GridRowId) => void;
  contactEmailsVisible: boolean;
  showContactEmails: (visibility: boolean) => void;
}

const MemberListHandlersContext = React.createContext<MemberListHandlers>({
  toggleAdmin: () => {},
  deleteUser: () => {},
  contactEmailsVisible: false,
  showContactEmails: () => {},
});

function ContactEmailCell(params: GridRenderCellParams) {
  const { contactEmailsVisible, showContactEmails } = React.useContext(
    MemberListHandlersContext,
  );

  const handleOnClick = () => {
    showContactEmails(!contactEmailsVisible);
  };

  return (
    <div className="flex gap-1 items-center h-full">
      <IconButton size="small" onClick={handleOnClick}>
        <div className="flex justify-center items-center text-gray-600 h-4 *:w-4 *:h-4">
          {contactEmailsVisible ? (
            <VisibilityOutlinedIcon />
          ) : (
            <VisibilityOffOutlinedIcon />
          )}
        </div>
      </IconButton>
      {contactEmailsVisible ? (
        params.value
      ) : (
        <Skeleton
          className="text-sm"
          // Add variation in width to Skeleton. This is deterministic based off the ID (i.e. row number)
          width={120 + Math.sin(Number(params.id.valueOf())) * 20}
          animation={false}
        />
      )}
    </div>
  );
}

function MemberTypeCell(params: GridRenderCellParams) {
  if (!params.value) return;

  let color = '';
  let icon: ReactNode = <></>;

  switch (params.value) {
    case 'Admin':
      color = 'bg-rose-200';
      icon = <GavelIcon fontSize="small" />;
      break;
    case 'Collaborator':
      color = 'bg-royal/30';
      icon = <HandymanIcon fontSize="small" />;
      break;
    case 'Member':
      icon = <PersonIcon fontSize="small" />;
      break;
  }

  return (
    <Chip
      icon={
        <div className="ml-2 flex justify-center items-center text-gray-600 h-4 *:w-4 *:h-4">
          {icon}
        </div>
      }
      label={params.value}
      className={`${color}`}
    />
  );
}

function ActionsCell(props: GridRenderCellParams) {
  const { deleteUser, toggleAdmin } = React.useContext(
    MemberListHandlersContext,
  );

  return (
    <GridActionsCell {...props}>
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => deleteUser(props.id)}
      />
      <GridActionsCellItem
        icon={<SecurityIcon />}
        label="Toggle Admin"
        onClick={() => toggleAdmin(props.id)}
        showInMenu
      />
    </GridActionsCell>
  );
}

interface CustomToolbarProps extends PropsFromSlot<GridSlots['toolbar']> {
  club: SelectClub;
}

function CustomToolbar({ club }: CustomToolbarProps) {
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Toolbar>
      <Typography
        variant="h2"
        className="grow-1 ml-2 text-base font-semibold text-haiti"
      >
        <span className="hidden sm:inline">
          {'Club Members' + (club ? ' for ' + club.name : '')}
        </span>
        <span className="inline sm:hidden">Club Members</span>
      </Typography>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnOutlinedIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
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

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ mx: 0.5 }}
      />

      <Tooltip title="Export">
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
        {/* <ExportPrint
            render={<MenuItem />}
            onClick={() => setExportMenuOpen(false)}
          >
            Print
          </ExportPrint> */}
        <ExportCsv
          render={<MenuItem />}
          onClick={() => setExportMenuOpen(false)}
        >
          Download as CSV
        </ExportCsv>
      </Menu>

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ mx: 0.5 }}
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

const columns: GridColDef<SelectUserMetadataToClubsWithUserMetadata>[] = [
  {
    field: 'firstName',
    valueGetter: (_value, row) => {
      return row.userMetadata?.firstName;
    },
    headerName: 'First Name',
    width: 130,
  },
  {
    field: 'lastName',
    valueGetter: (value, row) => {
      return row.userMetadata?.lastName;
    },
    headerName: 'Last Name',
    width: 130,
  },
  {
    field: 'year',
    valueGetter: (_value, row) => {
      return row.userMetadata?.year;
    },
    headerName: 'Year',
    renderHeader: (params) => (
      <ColumnHeaderWithIcon icon={<CalendarMonthOutlinedIcon />}>
        {params.colDef.headerName}
      </ColumnHeaderWithIcon>
    ),
    width: 140,
    renderCell: (params) => {
      if (!params.value) return;
      return <Chip label={params.value} />;
    },
  },
  {
    field: 'major',
    valueGetter: (_value, row) => {
      return row.userMetadata?.major;
    },
    headerName: 'Major',
    renderHeader: (params) => (
      <ColumnHeaderWithIcon icon={<SchoolOutlinedIcon />}>
        {params.colDef.headerName}
      </ColumnHeaderWithIcon>
    ),
    width: 200,
    renderCell: (params) => {
      if (!params.value) return;
      return <Chip label={params.value} />;
    },
  },
  {
    field: 'minor',
    valueGetter: (_value, row) => {
      return row.userMetadata?.minor;
    },
    headerName: 'Minor',
    width: 200,
    renderCell: (params) => {
      if (!params.value) return;
      return <Chip label={params.value} />;
    },
  },
  {
    field: 'contactEmail',
    valueGetter: (_value, row) => {
      return 'placeholder@utdallas.edu';
    },
    headerName: 'Contact Email',
    renderHeader: (params) => (
      <ColumnHeaderWithIcon icon={<EmailOutlinedIcon />}>
        {params.colDef.headerName}
      </ColumnHeaderWithIcon>
    ),
    width: 280,
    renderCell: (params) => <ContactEmailCell {...params} />,
    cellClassName: 'pl-1.5',
  },
  {
    field: 'memberType',
    valueGetter: (value) => {
      switch (value) {
        case 'President':
          return 'Admin';
        case 'Officer':
          return 'Collaborator';
        default:
          return value;
      }
    },
    headerName: 'Role',
    renderHeader: (params) => (
      <ColumnHeaderWithIcon icon={<PersonOutlinedIcon />}>
        {params.colDef.headerName}
      </ColumnHeaderWithIcon>
    ),
    width: 140,
    renderCell: (params) => <MemberTypeCell {...params} />,
  },
  { field: 'userId', headerName: 'ID', width: 360 },
  {
    field: 'actions',
    type: 'actions',
    width: 80,
    renderCell: (params) => <ActionsCell {...params} />,
    resizable: false,
  },
];

type MemberListProps = {
  members: SelectUserMetadataToClubsWithUserMetadata[];
  club?: SelectClub;
};

const MemberList = ({ members, club }: MemberListProps) => {
  const membersIndexed = members.map((member, index) => {
    return {
      ...member,
      id: index,
    };
  });

  const [contactEmailsVisible, showContactEmails] =
    React.useState<boolean>(false);

  const handleOnCellDoubleClick: GridEventListener<'cellDoubleClick'> = (
    params,
  ) => {
    if (params.colDef.field == 'contactEmail' && !contactEmailsVisible) {
      showContactEmails(true);
    }
  };

  const [rows, setRows] = React.useState<typeof membersIndexed>(membersIndexed);
  const [deleteUserId, deleteUser] = React.useState<GridRowId | null>(null);

  const deleteActiveRow = React.useCallback(
    (rowId: GridRowId) =>
      setRows((prevRows) => prevRows.filter((row) => row.id !== rowId)),
    [],
  );

  const handleCloseDialog = React.useCallback(() => {
    deleteUser(null);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    deleteActiveRow(deleteUserId!);
    handleCloseDialog();
  }, [deleteUserId, deleteActiveRow, handleCloseDialog]);

  const toggleAdmin = React.useCallback((id: GridRowId) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isAdmin: !row.memberType } : row,
      ),
    );
  }, []);

  const MemberListHandlers = React.useMemo<MemberListHandlers>(
    () => ({
      deleteUser,
      toggleAdmin,
      contactEmailsVisible,
      showContactEmails,
    }),
    [deleteUser, toggleAdmin, contactEmailsVisible, showContactEmails],
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <MemberListHandlersContext.Provider value={MemberListHandlers}>
        <DataGrid
          rows={rows}
          columns={columns}
          // MUI recommends type assertion for passing custom props to slots
          // Documentation: https://mui.com/x/common-concepts/custom-components/#type-custom-slots
          slots={{ toolbar: CustomToolbar as GridSlots['toolbar'] }}
          slotProps={{ toolbar: { club: club } as GridSlotProps['toolbar'] }}
          showToolbar
          initialState={{
            columns: { columnVisibilityModel: { userId: false, minor: false } },
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[25]}
          checkboxSelection
          disableRowSelectionOnClick
          className="rounded-lg"
          onCellDoubleClick={handleOnCellDoubleClick}
        />
      </MemberListHandlersContext.Provider>
      <Dialog
        open={deleteUserId !== null}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete this user?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="warning" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MemberList;

type ColumnHeaderWithIconProps = {
  icon: ReactNode;
  children: ReactNode;
};

const ColumnHeaderWithIcon = ({
  icon,
  children,
}: ColumnHeaderWithIconProps) => (
  <span className="flex gap-1 items-center">
    <div className="flex justify-center items-center text-gray-600 h-4 *:w-4 *:h-4">
      {icon}
    </div>
    <div className="font-[var(--unstable_DataGrid-headWeight)]">{children}</div>
  </span>
);
