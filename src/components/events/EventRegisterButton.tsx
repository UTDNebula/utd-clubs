'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Skeleton } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRegisterModal } from '@src/components/account/RegisterModalProvider';
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

  const [optimisticJoined, setOptimisticJoined] = useState<boolean>(false);

  useEffect(() => {
    setOptimisticJoined(joined ?? false);
  }, [joined]);

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
    onError: () => {
      setOptimisticJoined(joined ?? false);
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
    onError: () => {
      setOptimisticJoined(joined ?? false);
    },
  });

  const router = useRouter();

  let useAuthPage = false;

  const { setShowRegisterModal } = useRegisterModal(() => {
    useAuthPage = true;
  });

  const displayJoined = optimisticJoined;

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending || join.isPending || leave.isPending) return;

    if (!session) {
      // This will use auth page when this EventRegisterButton and a RegisterModal are not wrapped in a `<RegisterModalProvider>`.
      if (useAuthPage) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
        );
      } else {
        setShowRegisterModal(true);
      }
      return;
    }

    if (!displayJoined) {
      setOptimisticJoined(true);
      void join.mutateAsync({ id: eventId });
    } else {
      setOptimisticJoined(false);
      void leave.mutateAsync({ id: eventId });
    }
  };

  return (
    <Button
      onClick={onClick}
      loading={isPending || join.isPending || leave.isPending}
      variant="contained"
      className="normal-case"
      size={isHeader ? 'large' : 'small'}
      startIcon={displayJoined ? <CheckIcon /> : <AddIcon />}
    >
      {displayJoined ? 'Registered' : 'Register'}
    </Button>
  );
};

export default EventRegisterButton;

export const EventRegisterButtonPreview = () => {
  return (
    <Button
      variant="contained"
      className="normal-case"
      size="small"
      startIcon={<AddIcon />}
    >
      Register
    </Button>
  );
};

type EventRegisterButtonSkeletonProps = {
  isHeader?: boolean;
};

export const EventRegisterButtonSkeleton = ({
  isHeader,
}: EventRegisterButtonSkeletonProps) => {
  return (
    <Skeleton variant="rounded" className="rounded-full">
      <Button
        variant="contained"
        className="normal-case"
        size={isHeader ? 'large' : 'small'}
        startIcon={<AddIcon />}
      >
        Register
      </Button>
    </Skeleton>
  );
};
