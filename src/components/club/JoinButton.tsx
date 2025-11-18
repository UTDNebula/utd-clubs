'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
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
  const [localIsJoined, setLocalIsJoined] = useState(isJoined ?? false);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalIsJoined(isJoined ?? false);
  }, [isJoined]);

  const mutation = useMutation(
    api.club.joinLeave.mutationOptions({
      onSuccess: () => {
        // Invalidate queries to refresh the join status
        queryClient.invalidateQueries({
          queryKey: [['club', 'memberType'], { input: { id: clubId }, type: 'query' }],
        });
        // Toggle local state optimistically
        setLocalIsJoined((prev) => !prev);
      },
    }),
  );

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    mutation.mutate({ clubId });
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
  const displayIsJoined = localIsJoined || isJoined;

  return (
    <button
      onClick={handleJoin}
      disabled={mutation.isPending}
      className={`bg-blue-primary text-xs font-extrabold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-700 ${isHeader ? 'rounded-full px-8 py-4' : 'mr-2 rounded-2xl px-4 py-2'}`}
    >
      {displayIsJoined ? 'Joined' : 'Join'}
    </button>
  );
};

export default JoinButton;
