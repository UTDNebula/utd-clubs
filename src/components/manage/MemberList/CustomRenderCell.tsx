import DeleteIcon from '@mui/icons-material/Delete';
import GavelIcon from '@mui/icons-material/Gavel';
import HandymanIcon from '@mui/icons-material/Handyman';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import {
  GridActionsCell,
  GridActionsCellItem,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { ReactNode, useContext } from 'react';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';
import { authClient } from '@src/utils/auth-client';
import { MemberListContext } from './MemberListContext';

export function ContactEmailCell(params: GridRenderCellParams) {
  const { contactEmailsVisible, showContactEmails } =
    useContext(MemberListContext);

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

export function MemberTypeCell(params: GridRenderCellParams) {
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

export function ActionsCell(
  props: GridRenderCellParams<SelectUserMetadataToClubsWithUserMetadata>,
) {
  const { memberListDeletionState, memberListAbilities, removeMembers } =
    useContext(MemberListContext);

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
