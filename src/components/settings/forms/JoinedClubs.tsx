'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import Confirmation from '@src/components/Confirmation';
import MemberRoleChip from '@src/components/manage/MemberRoleChip';
import {
  SelectClub,
  SelectUserMetadataToClubsWithClub,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

type ClubsProps = {
  joinedClubs: SelectUserMetadataToClubsWithClub[];
};

export default function JoinedClubs({ joinedClubs }: ClubsProps) {
  const api = useTRPC();

  const joinLeaveMutation = useMutation(api.club.joinLeave.mutationOptions({}));

  const [leaveClub, setLeaveClub] =
    useState<SelectUserMetadataToClubsWithClub | null>(null);
  const [openLeaveModal, setOpenLeaveModal] = useState(false);

  return (
    <Panel heading="Joined Clubs">
      {joinedClubs.map((joinedClub) => (
        <ClubListItem
          joinedClub={joinedClub}
          key={joinedClub.club.id}
          onLeave={() => {
            setLeaveClub(joinedClub);
            setOpenLeaveModal(true);
          }}
        />
      ))}
      <Confirmation
        open={openLeaveModal}
        onClose={() => setOpenLeaveModal(false)}
        loading={joinLeaveMutation.isPending}
        title={`Leave ${leaveClub?.club.name}?`}
        contentText={
          <>
            You joined this club{' '}
            {leaveClub &&
              formatDistanceStrict(leaveClub?.joinedAt, new Date(), {
                addSuffix: true,
              })}
            .
            <br />
            This action cannot be undone.
          </>
        }
        confirmText="Leave"
        onConfirm={async () => {
          void joinLeaveMutation.mutateAsync(
            {
              clubId: leaveClub?.club.id,
            },
            {
              onSettled: () => {
                setOpenLeaveModal(false);
              },
              onSuccess: () => {
                const removeIndex = joinedClubs.findIndex(
                  (club) => club.clubId === leaveClub?.club.id,
                );

                joinedClubs.splice(removeIndex, 1);
              },
            },
          );
        }}
      />
    </Panel>
  );
}

type ClubListItemPropsBase = {
  onLeave?: () => void;
};

type ClubListItemProps = ClubListItemPropsBase &
  (
    | {
        joinedClub: SelectUserMetadataToClubsWithClub;
        club?: never;
      }
    | {
        joinedClub?: never;
        club: SelectClub;
      }
  );

function ClubListItem({
  joinedClub,
  club: clubProp,
  onLeave,
}: ClubListItemProps) {
  const club = joinedClub?.club ?? clubProp!;

  const clubApproved = club.approved === 'approved';

  const canManage =
    joinedClub?.memberType === 'Officer' ||
    joinedClub?.memberType === 'President';

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 min-h-16 sm:hover:bg-slate-100 max-sm:bg-slate-100 transition-colors rounded-lg">
      <Tooltip title="Click to view club directory page" disableInteractive>
        <Link
          href={club.approved === 'approved' ? `/directory/${club.slug}` : ''}
          className={`flex gap-2 pl-2 pr-4 items-center ${club.approved !== 'approved' ? 'pointer-events-none' : ''}`}
          aria-disabled={!clubApproved}
          tabIndex={!clubApproved ? -1 : undefined}
        >
          <div className="min-w-10 min-h-10">
            {club.profileImage && (
              <Image
                src={club.profileImage}
                alt={club.name + ' logo'}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
          <div className="flex flex-col grow pl-2 justify-center">
            <Typography variant="body1">{club.name}</Typography>
            {joinedClub && (
              <Typography variant="caption" className="text-slate-600">
                <span>{`Joined on ${joinedClub?.joinedAt.toLocaleString(
                  'en-us',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  },
                )}`}</span>
              </Typography>
            )}
          </div>
        </Link>
      </Tooltip>
      <div className="flex items-center gap-2 grow justify-end">
        {canManage && (
          <Chip
            className="h-fit rounded-full bg-white border-1 border-slate-400 [&>.MuiChip-label]:inline-block [&>.MuiChip-label]:p-1.5"
            label={
              <div className="flex gap-2">
                <MemberRoleChip memberType={joinedClub.memberType} />
                <Button
                  LinkComponent={Link}
                  href={`/manage/${club.slug ?? club.id}`}
                  variant="contained"
                  size="small"
                  className="normal-case"
                  startIcon={<TuneIcon />}
                >
                  Manage
                </Button>
              </div>
            }
          />
        )}
        <Tooltip title="Leave club">
          <IconButton aria-label="leave" onClick={onLeave}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
