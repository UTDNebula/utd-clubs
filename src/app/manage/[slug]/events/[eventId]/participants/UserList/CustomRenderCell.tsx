import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict';
import { useContext } from 'react';
import { SelectUserMetadataToClubsWithUserMetadata } from '@src/server/db/models';
import { authClient } from '@src/utils/auth-client';
import MemberRoleChip, {
  MemberTypes,
} from '../../../../../../../components/manage/MemberRoleChip';
import { UserListContext } from './UserListContext';

export function SmallTextCell(params: GridRenderCellParams) {
  return (
    <div className="flex items-center h-full">
      <Typography
        variant="body2"
        className=" overflow-hidden overflow-ellipsis"
      >
        {params.value}
      </Typography>
    </div>
  );
}

export function JoinedAtCell(params: GridRenderCellParams) {
  const { expandTimestamps } = useContext(UserListContext);

  const localeDateString = params.row.joinedAt.toLocaleString('en-us', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const distanceDateString = formatDistanceStrict(
    params.row.joinedAt,
    new Date(),
    {
      addSuffix: true,
    },
  );

  return (
    <Tooltip
      title={localeDateString}
      enterDelay={0}
      placement="top"
      arrow
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: { offset: [0, expandTimestamps ? -12 : -24] },
            },
          ],
        },
      }}
    >
      <Typography
        variant="body2"
        className="flex items-center h-full text-wrap"
      >
        {expandTimestamps
          ? localeDateString
          : distanceDateString.charAt(0).toUpperCase() +
            distanceDateString.slice(1)}
      </Typography>
    </Tooltip>
  );
}

export function ContactEmailCell(params: GridRenderCellParams) {
  const { contactEmailsVisible, showContactEmails } =
    useContext(UserListContext);

  const handleOnClick = () => {
    showContactEmails(!contactEmailsVisible);
  };

  return (
    <div className="flex gap-1 items-center h-full">
      <Tooltip title={contactEmailsVisible ? 'Hide' : 'Show'}>
        <IconButton size="small" onClick={handleOnClick}>
          <div className="flex justify-center items-center text-slate-600 dark:text-slate-400 h-4 *:w-4 *:h-4">
            {contactEmailsVisible ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )}
          </div>
        </IconButton>
      </Tooltip>
      {contactEmailsVisible ? (
        <Typography
          variant="body2"
          className="overflow-hidden overflow-ellipsis"
        >
          {params.value}
        </Typography>
      ) : (
        // Used this method instead of a dotted border in order to decrease
        // space between dots, which is not possible with the other method.
        //
        // Sine function adds variation to number of dots. This is
        // deterministic based off the row ID (i.e. row number)
        <Typography
          variant="body2"
          className="text-slate-600 dark:text-slate-400 select-none tracking-tighter"
        >
          {'•'.repeat(12 + Math.sin(Number(params.id.valueOf()) * 2) * 3)}
        </Typography>
      )}
    </div>
  );
}

const RoleToMemberType: Record<string, MemberTypes> = {
  Admin: 'President',
  Collaborator: 'Officer',
  Follower: 'Member',
};

export function MemberTypeCell(params: GridRenderCellParams) {
  if (!params.value) return;
  return (
    <MemberRoleChip memberType={RoleToMemberType[params.value] ?? 'Member'} />
  );
}

export function ActionsCell(
  props: GridRenderCellParams<SelectUserMetadataToClubsWithUserMetadata>,
) {
  const { memberListDeletionState, memberListAbilities, removeMembers } =
    useContext(UserListContext);

  const deleting = Array.isArray(removeMembers?.variables?.ids)
    ? removeMembers?.variables?.ids.includes(props.row.userId)
    : props.row.userId === removeMembers?.variables?.ids;

  const session = authClient.useSession();
  const self = props.row.userId === session.data?.user.id;

  return (
    <div>
      {memberListAbilities.removeUsers && (
        <Tooltip
          title={
            self ? (
              <div className="text-center">
                You cannot remove yourself
                <br />
                Another admin must remove you
              </div>
            ) : (
              'Remove'
            )
          }
          placement="right"
        >
          {/* This span is required to ensure the error tooltip shows when the IconButton is disabled */}
          <span>
            <IconButton
              onClick={() => {
                memberListDeletionState?.deleteSourceModel.setFromRowId(
                  props.id,
                );
                memberListDeletionState?.setOpenConfirmDialog(true);
              }}
              disabled={removeMembers?.isPending || self}
            >
              {removeMembers?.isPending && deleting ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}
    </div>
  );
}
