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
import RefreshIcon from '@mui/icons-material/Refresh';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  CircularProgress,
  IconButton,
  Skeleton,
  Snackbar,
  SnackbarCloseReason,
} from '@mui/material';
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
  FilterPanelTrigger,
  GridActionsCell,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridFooter,
  GridFooterContainer,
  GridRenderCellParams,
  GridRowId,
  gridRowSelectionCountSelector,
  GridRowSelectionModel,
  GridSlotProps,
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
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { ReactNode } from 'react';
import * as React from 'react';
import z from 'zod';
import { AppRouter } from '@src/server/api/root';
import { removeMemberSchema } from '@src/server/api/routers/clubEdit';
import {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadata,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

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

type ToastState = {
  open: boolean;
  type?: 'success' | 'error';
  user?: SelectUserMetadataToClubsWithUserMetadata;
  error?: TRPCClientErrorLike<AppRouter>;
};

// TODO: remove unused contexts, including: rowSelectionModel, setToastState, toggleAdmin, deleteUserId
interface MemberListHandlers {
  deleteUser: (id: GridRowId) => void;
  contactEmailsVisible: boolean;
  showContactEmails: (visibility: boolean) => void;
  removeMember:
    | UseMutationResult<
        void,
        TRPCClientErrorLike<AppRouter>,
        z.infer<typeof removeMemberSchema>
      >
    | undefined;
  getMembers:
    | UseQueryResult<
        z.infer<SelectUserMetadataToClubsWithUserMetadata>,
        TRPCClientErrorLike<AppRouter>
      >
    | undefined;
  refreshList: () => void;
}

const MemberListHandlersContext = React.createContext<MemberListHandlers>({
  deleteUser: () => {},
  contactEmailsVisible: false,
  showContactEmails: () => {},
  removeMember: undefined,
  getMembers: undefined,
  refreshList: () => {},
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
      <Tooltip title={contactEmailsVisible ? 'Hide' : 'Show'} placement="left">
        <IconButton size="small" onClick={handleOnClick}>
          <div className="flex justify-center items-center text-gray-600 h-4 *:w-4 *:h-4">
            {contactEmailsVisible ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )}
          </div>
        </IconButton>
      </Tooltip>
      {contactEmailsVisible ? (
        params.value
      ) : (
        <Skeleton
          className="text-sm"
          // Adds variation in width to Skeleton. This is deterministic based off the ID (i.e. row number)
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

function ActionsCell(
  props: GridRenderCellParams<SelectUserMetadataToClubsWithUserMetadata>,
) {
  const { deleteUser, removeMember } = React.useContext(
    MemberListHandlersContext,
  );
  const deleting = props.row.userId === removeMember?.variables?.id;

  const session = authClient.useSession();
  const self = props.row.userId === session.data?.user.id;

  return (
    <GridActionsCell {...props}>
      <GridActionsCellItem
        icon={
          removeMember?.isPending && deleting ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            // It isn't possible to add a tooltip for when the button is disabled.
            // See https://github.com/mui/mui-x/issues/14045
            <Tooltip title="Remove" placement="left">
              <DeleteIcon />
            </Tooltip>
          )
        }
        label="Delete"
        onClick={() => deleteUser(props.id)}
        disabled={removeMember?.isPending || self}
      />
      {/* <GridActionsCellItem
        icon={<SecurityIcon />}
        label="Toggle Admin"
        onClick={() => toggleAdmin(props.id)}
        showInMenu
      /> */}
    </GridActionsCell>
  );
}

interface CustomToolbarProps extends PropsFromSlot<GridSlots['toolbar']> {
  club: SelectClub;
}

function CustomToolbar({ club }: CustomToolbarProps) {
  const { refreshList } = React.useContext(MemberListHandlersContext);

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

      <Tooltip title="Refresh">
        <ToolbarButton onClick={refreshList}>
          <RefreshIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

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

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ mx: 0.5 }}
      />

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

function CustomFooter() {
  const { removeMember, getMembers } = React.useContext(
    MemberListHandlersContext,
  );

  const apiRef = useGridApiContext();
  const selectedRowCount = useGridSelector(
    apiRef,
    gridRowSelectionCountSelector,
  );

  const loading = removeMember?.isPending || getMembers?.isFetching;

  return (
    <GridFooterContainer>
      <div className="mx-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <CircularProgress color="inherit" size={20} />
            {removeMember?.isPending && <span>Deleting user</span>}
            {getMembers?.isFetching && <span>Refreshing</span>}
          </div>
        ) : selectedRowCount > 0 ? (
          `${selectedRowCount} ${selectedRowCount == 1 ? 'person' : 'people'} selected`
        ) : null}
      </div>
      <GridFooter
        sx={{
          border: 'none',
        }}
      />
    </GridFooterContainer>
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
    width: 230,
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
    width: 230,
    renderCell: (params) => {
      if (!params.value) return;
      return <Chip label={params.value} />;
    },
  },
  {
    field: 'contactEmail',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
];

const actionColumn: GridColDef<SelectUserMetadataToClubsWithUserMetadata> = {
  field: 'actions',
  type: 'actions',
  width: 40,
  renderCell: (params) => <ActionsCell {...params} />,
  resizable: false,
};

type MemberListProps = {
  members: SelectUserMetadataToClubsWithUserMetadata[];
  club: SelectClub;
};

const MemberList = ({ members, club }: MemberListProps) => {
  const session = authClient.useSession();

  const api = useTRPC();

  const removeMember = useMutation<
    void,
    TRPCClientErrorLike<AppRouter>,
    z.infer<typeof removeMemberSchema>
  >(api.club.edit.removeMember.mutationOptions({}));

  // Only used for the refresh button
  const getMembers = useQuery(
    api.club.getMembers.queryOptions({ id: club.id }, { enabled: false }),
  );

  const membersIndexed = members.map((member, index) => {
    return {
      ...member,
      id: index,
    };
  });

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>({
      type: 'include',
      ids: new Set<GridRowId>(),
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

  const [toastState, setToastState] = React.useState<ToastState>({
    open: false,
  });

  const handleCloseToast = React.useCallback(
    (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === 'clickaway') {
        return;
      }

      setToastState({ ...toastState, open: false });
    },
    [toastState],
  );

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
    handleCloseDialog();

    const targetMember = rows.find((row) => row.id == deleteUserId);

    void removeMember.mutateAsync(
      {
        clubId: club.id,
        id: targetMember?.userId ?? '',
      },
      {
        onSuccess: (data) => {
          deleteActiveRow(deleteUserId!);
          console.log(`Success! ${data}`);
          setToastState({ open: true, type: 'success', user: targetMember });
        },
        onError: (error) => {
          console.log(`Error: ${error}`);
          setToastState({
            open: true,
            type: 'error',
            user: targetMember,
            error: error,
          });
        },
      },
    );
  }, [
    club.id,
    deleteActiveRow,
    deleteUserId,
    handleCloseDialog,
    removeMember,
    rows,
  ]);

  const refreshList = React.useCallback(async () => {
    if (getMembers.isFetching) return;
    await getMembers.refetch();

    if (getMembers.data) {
      setRows(
        getMembers.data.map((member, index) => {
          return {
            ...member,
            id: index,
          };
        }),
      );
    }
  }, [getMembers]);

  const MemberListHandlers = React.useMemo<MemberListHandlers>(
    () => ({
      deleteUser,
      contactEmailsVisible,
      showContactEmails,
      removeMember,
      getMembers,
      refreshList,
    }),
    [
      deleteUser,
      contactEmailsVisible,
      showContactEmails,
      removeMember,
      getMembers,
      refreshList,
    ],
  );

  // Shows action column only if user is an admin
  const actionedColumns =
    rows.find((row) => row.userId === session.data?.user.id)?.memberType ===
    'President'
      ? [...columns, actionColumn]
      : columns;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <MemberListHandlersContext.Provider value={MemberListHandlers}>
        <Snackbar
          open={toastState.open}
          autoHideDuration={6000}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          onClose={handleCloseToast}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toastState.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toastState.type === 'success' ? (
              `Successfully removed ${toastState.user?.userMetadata?.firstName}!`
            ) : (
              <>
                <p>
                  {`Couldn't remove ${toastState.user?.userMetadata?.firstName}!`}
                </p>
                <p>{`Reason: ${toastState.error?.message}`}</p>
              </>
            )}
          </Alert>
        </Snackbar>
        <DataGrid
          rows={rows}
          columns={actionedColumns}
          // MUI recommends type assertion for passing custom props to slots
          // Documentation: https://mui.com/x/common-concepts/custom-components/#type-custom-slots
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
          className="rounded-lg"
          onCellDoubleClick={handleOnCellDoubleClick}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          hideFooterSelectedRowCount
        />
      </MemberListHandlersContext.Provider>
      <Dialog
        open={deleteUserId !== null}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove this user?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="warning" autoFocus>
            Remove
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
