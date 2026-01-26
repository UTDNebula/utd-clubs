'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Skeleton, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useRegisterModal } from '@src/components/account/RegisterModalProvider';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';
import EventEditButton from './EventEditButton';

type EventRegisterButtonProps = {
  isHeader?: boolean;
  clubId: string;
  clubSlug: string;
  eventId: string;
  calendarId?: string | null;
  fromGoogle: boolean;
};
const EventRegisterButton = ({
  isHeader,
  clubId,
  clubSlug,
  eventId,
  calendarId,
  fromGoogle,
}: EventRegisterButtonProps) => {
  const { data: session } = authClient.useSession();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: registerState, isPending } = useQuery(
    api.event.registerState.queryOptions({ id: eventId }),
  );

  const toggleRegistration = useMutation(
    api.event.toggleRegistration.mutationOptions({
      onMutate: async ({ id }) => {
        const queryKey = [
          ['event', 'registerState'],
          { input: { id }, type: 'query' },
        ];

        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey });

        // Remember previous value
        const previousState =
          queryClient.getQueryData<typeof registerState>(queryKey);

        // Optimistically update the cache
        queryClient.setQueryData(queryKey, (old: typeof registerState) => {
          if (!old) return old;

          const isRegistered = old.registered;

          return {
            ...old,
            registered: !isRegistered,
            registeredAt: isRegistered ? null : new Date(),
          };
        });
        return { previousState, queryKey };
      },
      onError: (_err, _vars, context) => {
        if (context?.previousState) {
          queryClient.setQueryData(context.queryKey, context.previousState);
        }
      },
      onSettled: (_data, _error, { id }) => {
        queryClient.invalidateQueries({
          queryKey: [
            ['event', 'registerState'],
            { input: { id }, type: 'query' },
          ],
        });
      },
    }),
  );

  const router = useRouter();

  const useAuthPage = useRef(false);
  // Although this feature is named similarly, it is unrelated to the event registration button.
  // Rather, it relates to the sign in/sign up authentication modal.
  const { setShowRegisterModal } = useRegisterModal(() => {
    useAuthPage.current = true;
  });

  const registered = registerState?.registered ?? false;

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending || toggleRegistration.isPending) return;

    if (!session) {
      // This will use auth page when this EventRegisterButton and a RegisterModal are not wrapped in a `<RegisterModalProvider>`.
      if (useAuthPage.current) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
        );
      } else {
        setShowRegisterModal(true);
      }
      return;
    }

    toggleRegistration.mutate({ id: eventId });
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
          calendarId={calendarId ?? null}
          userEmail={session?.user.email as string}
          fromGoogle={fromGoogle}
        />
      )}
      <Tooltip
        title={
          <div className="text-center">
            <span className="font-bold">
              {registered ? 'Unregister from event' : 'Register for event'}
            </span>
            {registered && registerState?.registeredAt && (
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
          loading={isPending || toggleRegistration.isPending}
          variant="contained"
          className="normal-case"
          size={isHeader ? 'large' : 'small'}
          startIcon={registered ? <CheckIcon /> : <AddIcon />}
        >
          {registered ? 'Registered' : 'Register'}
        </Button>
      </Tooltip>
      {!isHeader &&
        (memberType === 'President' || memberType === 'Officer') && (
          <EventEditButton
            isHeader={isHeader}
            clubSlug={clubSlug}
            eventId={eventId}
            calendarId={calendarId ?? null}
            userEmail={session?.user.email as string}
            fromGoogle={fromGoogle}
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
