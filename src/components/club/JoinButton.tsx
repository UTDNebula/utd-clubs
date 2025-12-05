'use client';

import { Button, Skeleton } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

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

  return (
    <Button
      variant="contained"
      size={isHeader ? 'large' : 'small'}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending || joinLeave.isPending) return;

        if (!session) {
          router.push(
            `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
          );
          return;
        }

        void joinLeave.mutateAsync({ clubId: clubID });
      }}
      className="normal-case"
      loading={isPending || joinLeave.isPending}
    >
      {memberType ? 'Joined' : 'Join'}
    </Button>
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
