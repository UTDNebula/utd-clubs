'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import React, { useState } from 'react';
import { useTRPC } from '@src/trpc/react';

type JoinButtonProps = {
  session: Session | null;
  isHeader?: boolean;
  clubID: string;
};

const JoinButton = ({ isHeader, session, clubID }: JoinButtonProps) => {
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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending || joinLeave.isPending) return;

        void joinLeave.mutateAsync({ clubId: clubID });
      }}
      className={`bg-blue-primary text-xs font-extrabold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-700 ${isHeader ? 'rounded-full px-8 py-4' : 'mr-2 rounded-2xl px-4 py-2'}`}
      disabled={isPending || joinLeave.isPending}
    >
      {memberType ? 'Joined' : 'Join'}
    </button>
  );
};

export default JoinButton;
