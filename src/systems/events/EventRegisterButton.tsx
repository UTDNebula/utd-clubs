'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Skeleton, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useTRPC } from '@/trpc/react';
import { authClient } from '@/common/modules/auth/auth-client';
import { useLoginModal } from '@/common/modules/loginModal';
import { setSnackbar, SnackbarPresets } from '@/common/modules/snackbar';
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
      onSuccess: (context) => {
        const joined = context?.registeredAt === undefined;

        setSnackbar({
          message: joined ? 'Registered to event!' : 'Unregistered from event!',
          type: joined ? 'success' : 'info',
          autoHideDuration: true,
          fitContent: true,
          closeOn: {
            clickaway: false,
            dismiss: true,
            escapeKeyDown: true,
            timeout: true,
          },
        });
      },
      onError: (error, _vars, context) => {
        setSnackbar(SnackbarPresets.errorWithMessage(error.message));
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
  const { openLoginModal } = useLoginModal({
    onNoProvider: () => {
      useAuthPage.current = true;
    },
  });

  const registered = registerState?.registered ?? false;

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending || toggleRegistration.isPending) return;

    if (!session) {
      // This will use auth page when this EventRegisterButton and a LoginModal are not wrapped in a `<LoginModalProvider>`.
      if (useAuthPage.current) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
        );
      } else {
        openLoginModal();
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
        <span>
          <Button
            onClick={onClick}
            loading={toggleRegistration.isPending}
            variant="contained"
            className="normal-case"
            size={isHeader ? 'large' : 'small'}
            startIcon={registered ? <CheckIcon /> : <AddIcon />}
          >
            {registered ? 'Registered' : 'Register'}
          </Button>
        </span>
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
