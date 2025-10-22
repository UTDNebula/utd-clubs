'use client';
import React, { useEffect, useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

type JoinButtonProps = {
  isHeader?: boolean;
  isJoined?: boolean;
  clubID: string;
};

const JoinButton = ({ isHeader, isJoined, clubID }: JoinButtonProps) => {
  const { data: session } = useSession();
  const api = useTRPC();
  const mutation = useMutation(api.club.joinLeave.mutationOptions());
  const clubId = clubID;

  // local state mirrors the prop but stays controlled locally after interactions
  const [joined, setJoined] = useState<boolean>(!!isJoined);

  // sync prop -> local state when prop changes
  useEffect(() => {
    setJoined(!!isJoined);
  }, [isJoined]);

  const handleJoin = () => {
    if (!session) return;
    mutation.mutate({ clubId });
    setJoined((prev) => !prev);
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
      className={`bg-blue-primary text-xs font-extrabold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-700 ${isHeader ? 'rounded-full px-8 py-4' : 'mr-2 rounded-2xl px-4 py-2'}`}
    >
      {joined ? 'Joined' : 'Join'}
    </button>
  );
};

export default JoinButton;
