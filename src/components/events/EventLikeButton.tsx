'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CheckIcon, PlusIcon } from '@src/icons/Icons';
import { useTRPC } from '@src/trpc/react';

type buttonProps = {
  eventId: string;
  liked: boolean;
};
const EventLikeButton = ({ eventId, liked }: buttonProps) => {
  const api = useTRPC();
  const join = useMutation(api.event.joinEvent.mutationOptions());
  const leave = useMutation(api.event.leaveEvent.mutationOptions());
  const router = useRouter();
  return (
    <button
      type="submit"
      className="h-10 w-10 rounded-full bg-white p-1.5 shadow-lg"
      onClick={() => {
        if (!liked) {
          void join.mutateAsync({ id: eventId }).then(() => {
            router.refresh();
          });
        } else {
          void leave.mutateAsync({ id: eventId }).then(() => {
            router.refresh();
          });
        }
      }}
    >
      {liked ? (
        <CheckIcon fill="fill-slate-800" />
      ) : (
        <PlusIcon fill="fill-slate-800" />
      )}
    </button>
  );
};
export default EventLikeButton;
