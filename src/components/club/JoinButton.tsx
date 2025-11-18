'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import React from 'react';
import { useTRPC } from '@src/trpc/react';

type JoinButtonProps = {
  session: Session | null;
  isHeader?: boolean;
  isJoined?: boolean;
  clubID: string;
};

const JoinButton = ({
  isHeader,
  session,
  isJoined,
  clubID,
}: JoinButtonProps) => {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const clubId = clubID;
  
  const mutation = useMutation(api.club.joinLeave.mutationOptions());
  
  const handleJoin = async () => {
    try {
      await mutation.mutateAsync({ clubId });
      // Invalidate the memberType query to refetch after join/leave
      const queryOptions = api.club.memberType.queryOptions({ id: clubId });
      void queryClient.invalidateQueries({
        queryKey: queryOptions.queryKey,
      });
    } catch (error) {
      // Error handling is done by the mutation
      console.error('Failed to join/leave club:', error);
    }
  };
  if (!session) {
    return (
      <button
        className={`text-xs font-extrabold text-white disabled:bg-slate-700 ${
          isHeader
            ? 'rounded-full px-8 py-4'
            : 'mr-2 rounded-2xl border-solid px-4 py-2'
        }`}
        disabled
      >
        Join
      </button>
    );
  }
  return (
    <button
      onClick={handleJoin}
      disabled={mutation.isPending}
      className={`bg-blue-primary text-xs font-extrabold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-700 ${isHeader ? 'rounded-full px-8 py-4' : 'mr-2 rounded-2xl px-4 py-2'}`}
    >
      {isJoined ? 'Joined' : 'Join'}
    </button>
  );
};

export default JoinButton;
