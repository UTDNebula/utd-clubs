'use client';

import { Button } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import React from 'react';
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

  return (
    <Button
      variant="contained"
      size={isHeader ? 'large' : 'small'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending || joinLeave.isPending) return;

        if (!session) {
          signIn();
          return;
        }

        void joinLeave.mutateAsync({ clubId: clubID });
      }}
      className="normal-case"
      loading={isPending || joinLeave.isPending}
    >
      {memberType ? 'Joined' : 'Join'}
    </Button>
  );
};

export default JoinButton;
