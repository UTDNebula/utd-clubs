'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@src/trpc/react';

type buttonProps = {
  eventId: string;
  liked: boolean;
};
const EventLikeButton = ({ eventId, liked }: buttonProps) => {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: joined, isPending } = useQuery(
    api.event.joinedEvent.queryOptions({ id: eventId }),
  );

  const join = useMutation({
    ...api.event.joinEvent.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ['event', 'joinedEvent'],
          { input: { id: eventId }, type: 'query' },
        ],
      });
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
  });

  return (
    <IconButton
      className="bg-royal [&:not(.MuiIconButton-loading)>svg]:fill-white"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending || join.isPending || leave.isPending) return;

        if (!joined) {
          void join.mutateAsync({ id: eventId });
        } else {
          void leave.mutateAsync({ id: eventId });
        }
      }}
      loading={isPending || join.isPending || leave.isPending}
    >
      {joined ? <CheckIcon /> : <AddIcon />}
    </IconButton>
  );
};
export default EventLikeButton;
