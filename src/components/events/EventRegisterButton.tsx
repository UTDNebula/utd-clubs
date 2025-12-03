'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Button, IconButton } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@src/trpc/react';

type buttonProps = {
  isHeader?: boolean;
  eventId: string;
};
const EventLikeButton = ({ isHeader, eventId }: buttonProps) => {
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

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending || join.isPending || leave.isPending) return;

    if (!joined) {
      void join.mutateAsync({ id: eventId });
    } else {
      void leave.mutateAsync({ id: eventId });
    }
  };

  if (isHeader) {
    return (
      <Button
        onClick={onClick}
        loading={isPending || join.isPending || leave.isPending}
        variant="contained"
        className="normal-case"
        size="large"
      >
        {joined ? 'Registered' : 'Register'}
      </Button>
    );
  }

  return (
    <IconButton
      className="bg-royal [&:not(.MuiIconButton-loading)>svg]:fill-white"
      onClick={onClick}
      loading={isPending || join.isPending || leave.isPending}
    >
      {joined ? <CheckIcon /> : <AddIcon />}
    </IconButton>
  );
};
export default EventLikeButton;
