'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Button, IconButton, Skeleton } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

type buttonProps = {
  isHeader?: boolean;
  eventId: string;
};
const EventRegisterButton = ({ isHeader, eventId }: buttonProps) => {
  const { data: session } = authClient.useSession();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: joined, isPending } = useQuery(
    api.event.joinedEvent.queryOptions({ id: eventId }),
  );

  const join = useMutation({
    ...api.event.joinEvent.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ['event', 'joinedEvent'],
          { input: { id: eventId }, type: 'query' },
        ],
      });
    },
  });

  const leave = useMutation({
    ...api.event.leaveEvent.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ['event', 'joinedEvent'],
          { input: { id: eventId }, type: 'query' },
        ],
      });
    },
  });

  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending || join.isPending || leave.isPending) return;

    if (!session) {
      router.push(
        `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
      );
      return;
    }

    if (!joined) {
      void join.mutateAsync({ id: eventId });
    } else {
      void leave.mutateAsync({ id: eventId });
    }
  };

  if (isHeader) {
    return (
      <Button
        onClick={onClick}
        loading={isPending || join.isPending || leave.isPending}
        variant="contained"
        className="normal-case"
        size="large"
      >
        {joined ? 'Registered' : 'Register'}
      </Button>
    );
  }

  return (
    <IconButton
      className="bg-royal [&:not(.MuiIconButton-loading)>svg]:fill-white"
      onClick={onClick}
      loading={isPending || join.isPending || leave.isPending}
    >
      {joined ? <CheckIcon /> : <AddIcon />}
    </IconButton>
  );
};

export default EventRegisterButton;

type EventRegisterButtonSkeletonProps = {
  isHeader?: boolean;
};

export const EventRegisterButtonSkeleton = ({
  isHeader,
}: EventRegisterButtonSkeletonProps) => {
  if (isHeader) {
    return (
      <Skeleton variant="rounded" className="rounded-full">
        <Button variant="contained" className="normal-case" size="large">
          Register
        </Button>
      </Skeleton>
    );
  }

  return (
    <Skeleton variant="rounded" className="rounded-full">
      <IconButton>
        <AddIcon />
      </IconButton>
    </Skeleton>
  );
};
