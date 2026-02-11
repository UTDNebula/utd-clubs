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
import { SelectUserMetadataToClubsWithClub } from '@src/server/db/models';
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
    <Panel heading="Followed Clubs">
      {joinedClubs.length > 0 ? (
        joinedClubs.map((joinedClub) => (
          <div key={joinedClub.club.id} className="shrink-0">
            <ClubListItem
              joinedClub={joinedClub}
              onLeave={() => {
                setLeaveClub(joinedClub);
                setOpenLeaveModal(true);
              }}
            />
          </div>
        ))
      ) : (
        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-md font-medium text-slate-600 dark:text-slate-400">
          Not following any clubs.
        </div>
      )}
      <Confirmation
        open={openLeaveModal}
        onClose={() => setOpenLeaveModal(false)}
        loading={joinLeaveMutation.isPending}
        title={`Unfollow ${leaveClub?.club.name}?`}
        contentText={
          <>
            You followed this club{' '}
            {leaveClub &&
              formatDistanceStrict(leaveClub?.joinedAt, new Date(), {
                addSuffix: true,
              })}
            .
            <br />
            This action cannot be undone.
          </>
        }
        confirmText="Unfollow"
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

type ClubListItemProps = {
  onLeave?: () => void;
  joinedClub: SelectUserMetadataToClubsWithClub;
};

function ClubListItem({ joinedClub, onLeave }: ClubListItemProps) {
  const club = joinedClub?.club;

  const clubApproved = club.approved === 'approved';

  const canManage =
    joinedClub?.memberType === 'Officer' ||
    joinedClub?.memberType === 'President';

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 min-h-16 max-sm:bg-neutral-100 dark:max-sm:bg-neutral-800 sm:hover:bg-neutral-100 dark:sm:hover:bg-neutral-800 transition-colors rounded-lg">
      <Tooltip title="View club directory page" disableInteractive>
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
                className="rounded-sm"
              />
            )}
          </div>
          <div className="flex flex-col grow pl-2 justify-center">
            <Typography variant="body1">{club.name}</Typography>
            {joinedClub && (
              <Typography
                variant="caption"
                className="text-neutral-600 dark:text-neutral-400"
              >
                <span>{`Following since ${joinedClub?.joinedAt.toLocaleString(
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
            className="h-fit rounded-full bg-white dark:bg-neutral-900 border-1 border-neutral-400 dark:border-neutral-600 [&>.MuiChip-label]:inline-block [&>.MuiChip-label]:p-1.5"
            label={
              <div className="flex gap-2">
                <MemberRoleChip memberType={joinedClub.memberType} />
                <Button
                  LinkComponent={Link}
                  href={`/manage/${club.slug}`}
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
        <Tooltip title="Unfollow club">
          <IconButton aria-label="unfollow" onClick={onLeave}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
