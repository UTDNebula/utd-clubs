'use client';

import { Button, Skeleton } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';
import {
  NoRegisterModalProviderError,
  useRegisterModalContext,
} from '../account/RegisterModalProvider';

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

  let setShowRegisterModal: (value: boolean) => void;
  try {
    const context = useRegisterModalContext();
    setShowRegisterModal = context.setShowRegisterModal;
  } catch (e) {
    if (e instanceof NoRegisterModalProviderError) {
      useAuthPage = true;
    } else {
      throw e;
    }
  }

  return (
    <Button
      variant="contained"
      size={isHeader ? 'large' : 'small'}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending || joinLeave.isPending) return;

        if (!session) {
          // Will use auth page when this JoinButton and a RegisterModal are not wrapped in a `<RegisterModalProvider>`.
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
