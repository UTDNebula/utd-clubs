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
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
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
import { removeMembersSchema } from '@src/server/api/routers/clubEdit';
import {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadata,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

type deleteSourceModelSources = 'rowId' | 'selection' | undefined;

type deleteSourceModelValues = {
  rowId: GridRowId | null;
  source: deleteSourceModelSources;
  setFromRowId: (rowId: GridRowId) => void;
  setFromSelection: () => void;
  unset: () => void;
};

function useMemberListDeletionState(
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

type MemberListAbilities = {
  removeUsers?: boolean;
  refresh?: boolean;
  downloadCSV?: boolean;
  viewAccountEmail?: boolean;
};

type getFormattedListStringOptions = {
  maxSpecified: number;
  termString: {
    singular: string;
    plural: string;
  };
  oxfordComma: boolean;
};

const getFormattedListStringOptionsDefaults: getFormattedListStringOptions = {
  maxSpecified: 1,
  termString: { singular: 'item', plural: 'items' },
  oxfordComma: true,
};

function getFormattedListString(
  list: string | string[],
  options?: Partial<getFormattedListStringOptions>,
): string {
  const normalizedList = Array.isArray(list) ? list : [list];
  const defaultedOptions = {
    ...getFormattedListStringOptionsDefaults,
    ...options,
  };

  const outputListItems: string[] = [];

  if (normalizedList.length === 0)
    return `0 ${defaultedOptions.termString.plural}`;

  for (
    let i = 0;
    (defaultedOptions.maxSpecified >= 0
      ? i < defaultedOptions.maxSpecified
      : true) && i < normalizedList.length;
    i++
  ) {
    outputListItems.push(normalizedList[i] ?? '');
  }

  if (defaultedOptions.maxSpecified >= 0) {
    const otherCount = normalizedList.length - defaultedOptions.maxSpecified;
    if (otherCount > 0) {
      outputListItems.push(
        `${otherCount} ${defaultedOptions.maxSpecified !== 0 ? 'other ' : ''}${
          otherCount === 1
            ? defaultedOptions.termString.singular
            : defaultedOptions.termString.plural
        }`,
      );
    }
  }

  const lastOutputItem: string =
    outputListItems.length > 1 ? (outputListItems.pop() ?? '') : '';

  let output = outputListItems.join(', ');
  output += lastOutputItem
    ? `${outputListItems.length >= 2 && defaultedOptions.oxfordComma ? ',' : ''} and ${lastOutputItem}`
    : '';

  return output;
}

function getFormattedUserListString(
  users?:
    | SelectUserMetadataToClubsWithUserMetadata
    | SelectUserMetadataToClubsWithUserMetadata[],
): string {
  if (users === undefined) return 'unknown user(s)';

  const normalizedUsers = Array.isArray(users) ? users : [users];

  return getFormattedListString(
    normalizedUsers.map((ele) => ele.userMetadata?.firstName ?? ''),
    {
      maxSpecified: 1,
      oxfordComma: true,
      termString: { singular: 'person', plural: 'people' },
    },
  );
}

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
  string?: string;
  error?: TRPCClientErrorLike<AppRouter>;
};

// TODO: Possible remove usused: rowSelectionModel
interface MemberListHandlers {
  memberListDeletionState:
    | ReturnType<typeof useMemberListDeletionState>
    | undefined;
  memberListAbilities: MemberListAbilities;
  contactEmailsVisible: boolean;
  showContactEmails: (visibility: boolean) => void;
  removeMembers:
    | UseMutationResult<
        void,
        TRPCClientErrorLike<AppRouter>,
        z.infer<typeof removeMembersSchema>
      >
    | undefined;
  getMembers:
    | UseQueryResult<
        z.infer<SelectUserMetadataToClubsWithUserMetadata>,
        TRPCClientErrorLike<AppRouter>
      >
    | undefined;
  refreshList: () => void;
  rowSelectionModel: GridRowSelectionModel;
}

const MemberListHandlersContext = React.createContext<MemberListHandlers>({
  memberListDeletionState: undefined,
  memberListAbilities: {
    removeUsers: false,
    downloadCSV: true,
    viewAccountEmail: true,
  },
  contactEmailsVisible: false,
  showContactEmails: () => {},
  removeMembers: undefined,
  getMembers: undefined,
  refreshList: () => {},
  rowSelectionModel: {
    type: 'include',
    ids: new Set<GridRowId>(),
  },
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
  const { memberListDeletionState, memberListAbilities, removeMembers } =
    React.useContext(MemberListHandlersContext);

  const deleting = Array.isArray(removeMembers?.variables?.ids)
    ? removeMembers?.variables?.ids.includes(props.row.userId)
    : props.row.userId === removeMembers?.variables?.ids;

  const session = authClient.useSession();
  const self = props.row.userId === session.data?.user.id;

  return (
    <GridActionsCell {...props}>
      {memberListAbilities.removeUsers && (
        <GridActionsCellItem
          icon={
            removeMembers?.isPending && deleting ? (
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
          onClick={() => {
            memberListDeletionState?.deleteSourceModel.setFromRowId(props.id);
            memberListDeletionState?.setOpenConfirmDialog(true);
          }}
          disabled={removeMembers?.isPending || self}
        />
      )}
    </GridActionsCell>
  );
}

interface CustomToolbarProps extends PropsFromSlot<GridSlots['toolbar']> {
  club: SelectClub;
}

function CustomToolbar({ club }: CustomToolbarProps) {
  const { memberListDeletionState, memberListAbilities, refreshList } =
    React.useContext(MemberListHandlersContext);

  const apiRef = useGridApiContext();
  const selectedRowCount = useGridSelector(
    apiRef,
    gridRowSelectionCountSelector,
  );

  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

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
                <Tooltip title="Remove Selected">
                  <ToolbarButton
                    onClick={() => {
                      memberListDeletionState?.deleteSourceModel.setFromSelection();
                      memberListDeletionState?.setOpenConfirmDialog(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </ToolbarButton>
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

function CustomFooter() {
  const { memberListDeletionState, removeMembers, getMembers } =
    React.useContext(MemberListHandlersContext);

  const loading = removeMembers?.isPending || getMembers?.isFetching;

  return (
    <GridFooterContainer>
      <div className="mx-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <CircularProgress color="inherit" size={20} />
            {removeMembers?.isPending && (
              <span>{`Removing ${getFormattedUserListString(memberListDeletionState?.deleteUsers)}`}</span>
            )}
            {getMembers?.isFetching && <span>Refreshing</span>}
          </div>
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

  const removeMembers = useMutation<
    void,
    TRPCClientErrorLike<AppRouter>,
    z.infer<typeof removeMembersSchema>
  >(api.club.edit.removeMembers.mutationOptions({}));

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

  const deleteRows = React.useCallback((rowId: GridRowId | GridRowId[]) => {
    const normalizedGridRowIds = Array.isArray(rowId) ? rowId : [rowId];
    setRows((prevRows) =>
      prevRows.filter((row) => !normalizedGridRowIds.includes(row.id)),
    );
  }, []);

  const handleCloseDialog = React.useCallback(() => {
    setOpenConfirmDialog(false);
  }, [setOpenConfirmDialog]);

  const handleConfirmDelete = React.useCallback(() => {
    handleCloseDialog();

    const userListString = getFormattedUserListString(deleteUsers);

    const targetUserIds = Array.isArray(deleteUsers)
      ? deleteUsers?.map((row) => row.userId)
      : deleteUsers?.userId;

    void removeMembers.mutateAsync(
      {
        clubId: club.id,
        ids: targetUserIds ?? '',
      },
      {
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

  const refreshList = React.useCallback(async () => {
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

  const isAdmin =
    rows.find((row) => row.userId === session.data?.user.id)?.memberType ===
    'President';

  const memberListAbilities: MemberListAbilities = React.useMemo(() => {
    return {
      removeUsers: isAdmin,
      refresh: true,
      downloadCSV: true,
      viewAccountEmail: true,
    };
  }, [isAdmin]);

  // Shows action column only if user is an admin
  const actionedColumns = isAdmin ? [...columns, actionColumn] : columns;

  const MemberListHandlers = React.useMemo<MemberListHandlers>(
    () => ({
      memberListDeletionState,
      memberListAbilities,
      contactEmailsVisible,
      showContactEmails,
      removeMembers,
      getMembers,
      refreshList,
      rowSelectionModel,
    }),
    [
      memberListDeletionState,
      memberListAbilities,
      contactEmailsVisible,
      showContactEmails,
      removeMembers,
      getMembers,
      refreshList,
      rowSelectionModel,
    ],
  );

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
            <p>{toastState.string}</p>
            <p>
              {toastState.type === 'error' && toastState.error
                ? `Reason: ${toastState.error.message}`
                : ''}
            </p>
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
          disableRowSelectionExcludeModel
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
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <span>Remove </span>
          {getFormattedUserListString(deleteUsers)}
          <span>?</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="warning" autoFocus>
            Remove
            {Array.isArray(deleteUsers) && deleteUsers.length > 1 ? ' All' : ''}
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
