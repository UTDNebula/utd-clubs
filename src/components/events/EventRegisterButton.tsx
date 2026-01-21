'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Skeleton, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRegisterModal } from '@src/components/account/RegisterModalProvider';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';
import EventEditButton from './EventEditButton';

type EventRegisterButtonProps = {
  isHeader?: boolean;
  clubId: string;
  clubSlug: string;
  eventId: string;
};
const EventRegisterButton = ({
  isHeader,
  clubId,
  clubSlug,
  eventId,
}: EventRegisterButtonProps) => {
  const { data: session } = authClient.useSession();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: registerState, isPending } = useQuery(
    api.event.registerState.queryOptions({ id: eventId }),
  );

  const [optimisticJoined, setOptimisticJoined] = useState<boolean>(false);

  useEffect(() => {
    setOptimisticJoined(registerState?.registered ?? false);
  }, [registerState?.registered]);

  const join = useMutation({
    ...api.event.joinEvent.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ['event', 'registerState'],
          { input: { id: eventId }, type: 'query' },
        ],
      });
    },
    onError: () => {
      setOptimisticJoined(registerState?.registered ?? false);
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
      setOptimisticJoined(registerState?.registered ?? false);
    },
  });

  const router = useRouter();

  let useAuthPage = false;
  // Although this feature is named similarly, it is unrelated to the event registration button.
  // Rather, it relates to the sign in/sign up authentication modal.
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

  const { data: memberType } = useQuery(
    api.club.memberType.queryOptions({ id: clubId }),
  );

  return (
    <>
      {isHeader && (memberType === 'President' || memberType === 'Officer') && (
        <EventEditButton
          isHeader={isHeader}
          clubSlug={clubSlug}
          eventId={eventId}
        />
      )}
      <Tooltip
        title={
          <div className="text-center">
            <span className="font-bold">
              {displayJoined ? 'Unregister from event' : 'Register for event'}
            </span>
            {displayJoined && registerState?.registeredAt && (
              <>
                <br />
                Registered on{' '}
                {registerState?.registeredAt.toLocaleString('en-us', {
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
          onClick={onClick}
          loading={isPending || join.isPending || leave.isPending}
          variant="contained"
          className="normal-case"
          size={isHeader ? 'large' : 'small'}
          startIcon={displayJoined ? <CheckIcon /> : <AddIcon />}
        >
          {displayJoined ? 'Registered' : 'Register'}
        </Button>
      </Tooltip>
      {!isHeader &&
        (memberType === 'President' || memberType === 'Officer') && (
          <EventEditButton
            isHeader={isHeader}
            clubSlug={clubSlug}
            eventId={eventId}
          />
        )}
    </>
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
