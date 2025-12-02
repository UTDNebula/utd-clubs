'use client';

import { useMutation } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import React, { useState } from 'react';
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
  const mutation = useMutation(api.club.joinLeave.mutationOptions());
  const clubId = clubID;
  const [isDisabled, setDisabled] = useState(isJoined ?? false);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    mutation.mutate({ clubId });
    setDisabled(!isDisabled);
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
      className={`bg-royal text-xs font-extrabold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-700 ${isHeader ? 'rounded-full px-8 py-4' : 'mr-2 rounded-2xl px-4 py-2'}`}
    >
      {isDisabled ? 'Joined' : 'Join'}
    </button>
  );
};

export default JoinButton;
