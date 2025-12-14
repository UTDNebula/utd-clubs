'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import TuneIcon from '@mui/icons-material/Tune';
import { Button, Skeleton, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useRegisterModal } from '@src/components/account/RegisterModalProvider';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

type JoinButtonProps = {
  isHeader?: boolean;
  clubId: string;
  clubSlug?: string;
};

const JoinButton = ({ isHeader, clubId, clubSlug }: JoinButtonProps) => {
  const { data: session } = authClient.useSession();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: memberType, isPending } = useQuery(
    api.club.memberType.queryOptions({ id: clubId }),
  );

  const joinLeave = useMutation(
    api.club.joinLeave.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            ['club', 'memberType'],
            { input: { id: clubId }, type: 'query' },
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

  if (memberType === 'Officer' || memberType === 'President') {
    return (
      <Link href={`/manage/${clubSlug ?? clubId}`}>
        <Button
          variant="contained"
          size={isHeader ? 'large' : 'small'}
          className="normal-case"
          startIcon={<TuneIcon />}
        >
          Manage
        </Button>
      </Link>
    );
  }

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

          void joinLeave.mutateAsync({ clubId: clubId });
        }}
        className="normal-case"
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
