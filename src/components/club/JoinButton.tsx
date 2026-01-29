'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import TuneIcon from '@mui/icons-material/Tune';
import { Button, Skeleton, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
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
  const { data: memberState, isPending } = useQuery(
    api.club.memberState.queryOptions({ id: clubId }),
  );

  const joinLeave = useMutation(
    api.club.joinLeave.mutationOptions({
      onMutate: async ({ clubId }) => {
        const queryKey = [
          ['club', 'memberState'],
          { input: { id: clubId }, type: 'query' },
        ];

        // Cancel outgoing refetches
        await queryClient.cancelQueries({
          queryKey,
        });

        // Remember previous value
        const previousState =
          queryClient.getQueryData<typeof memberState>(queryKey);

        // Optimistically update the cache
        queryClient.setQueryData(queryKey, (old: typeof memberState) => {
          if (!old) return old;

          return {
            ...old,
            memberType: old.memberType ? null : 'Member',
            joinedAt: old.memberType ? null : new Date(),
          };
        });

        // Return context for rollback
        return { previousState, queryKey };
      },
      onError: (_err, _vars, context) => {
        if (context?.previousState) {
          queryClient.setQueryData(context.queryKey, context.previousState);
        }
      },
      onSettled: (_data, _error, { clubId }) => {
        queryClient.invalidateQueries({
          queryKey: [
            ['club', 'memberState'],
            { input: { id: clubId }, type: 'query' },
          ],
        });
      },
    }),
  );

  const router = useRouter();

  const useAuthPage = useRef(false);

  const { setShowRegisterModal } = useRegisterModal(() => {
    useAuthPage.current = true;
  });

  const memberType = memberState?.memberType ?? null;

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
    <Tooltip
      title={
        <div className="text-center">
          <span className="font-bold">
            {memberType ? 'Unfollow' : 'Follow'}
          </span>
          {memberType && memberState?.joinedAt && (
            <>
              <br />
              Following since{' '}
              {memberState?.joinedAt.toLocaleString('en-us', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </>
          )}
        </div>
      }
    >
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
            if (useAuthPage.current) {
              router.push(
                `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
              );
            } else {
              setShowRegisterModal(true);
            }
            return;
          }

          void joinLeave.mutate({ clubId });
        }}
        className="normal-case"
        loading={isPending || joinLeave.isPending}
      >
        {memberType ? 'Following' : 'Follow'}
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
        Follow
      </Button>
    </Skeleton>
  );
};
