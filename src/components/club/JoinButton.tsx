'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Skeleton, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';
import { useRegisterModal } from '../account/RegisterModalProvider';

type JoinButtonProps = {
  isHeader?: boolean;
  clubID: string;
};

const JoinButton = ({ isHeader, clubID }: JoinButtonProps) => {
  const { data: session } = authClient.useSession();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: memberType, isPending } = useQuery(
    api.club.memberType.queryOptions({ id: clubID }),
  );

  const joinLeave = useMutation(
    api.club.joinLeave.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            ['club', 'memberType'],
            { input: { id: clubID }, type: 'query' },
          ],
        });
      },
    }),
  );

  const router = useRouter();

  let useAuthPage = false;

  const { setShowRegisterModal } = useRegisterModal(() => {
    useAuthPage = true;
  });

  return (
    <Tooltip title={memberType ? 'Click to leave club' : 'Click to join club'}>
      <Button
        variant="contained"
        size={isHeader ? 'large' : 'small'}
        startIcon={memberType ? <CheckIcon /> : <AddIcon />}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (isPending || joinLeave.isPending) return;

          if (!session) {
            // This will use auth page when this JoinButton and a RegisterModal are not wrapped in a `<RegisterModalProvider>`.
            if (useAuthPage) {
              router.push(
                `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
              );
            } else {
              setShowRegisterModal(true);
            }
            return;
          }

          void joinLeave.mutateAsync({ clubId: clubID });
        }}
        className={`normal-case ${memberType ? 'bg-slate-400 hover:bg-slate-500' : ''}`}
        loading={isPending || joinLeave.isPending}
      >
        {memberType ? 'Joined' : 'Join'}
      </Button>
    </Tooltip>
  );
};

export default JoinButton;

type JoinButtonSkeletonProps = {
  isHeader?: boolean;
};

export const JoinButtonSkeleton = ({ isHeader }: JoinButtonSkeletonProps) => {
  return (
    <Skeleton variant="rounded" className="rounded-full">
      <Button
        variant="contained"
        size={isHeader ? 'large' : 'small'}
        className="normal-case"
      >
        Join
      </Button>
    </Skeleton>
  );
};
