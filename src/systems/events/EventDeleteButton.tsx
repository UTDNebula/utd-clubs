'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Confirmation from '@/common/components/Confirmation';
import { SelectEvent } from '@/server/db/models';
import { useTRPC } from '@/trpc/react';

export default function EventDeleteButton({
  isHeader,
  event,
  view = 'manage',
}: {
  isHeader?: boolean;
  event: SelectEvent;
  view?: 'manage' | 'admin';
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const api = useTRPC();
  const deleteEvent = useMutation(
    (view === 'manage'
      ? api.event.delete
      : api.admin.deleteEvent
    ).mutationOptions({
      onSuccess: () => {
        setOpen(false);
        router.refresh();
      },
    }),
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {isHeader ? (
        <Button
          variant="contained"
          color="error"
          size="large"
          className="normal-case"
          startIcon={<DeleteIcon />}
          onClick={handleClick}
        >
          Delete
        </Button>
      ) : (
        <Tooltip title="Delete Event">
          <IconButton
            size="small"
            aria-label="Delete Event"
            sx={{
              backgroundColor: 'error.main',
              color: 'common.white',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
            onClick={handleClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}

      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        contentText={
          <>
            This will permanently delete <b>{event.name}</b>.
          </>
        }
        onConfirm={() => {
          deleteEvent.mutate({ id: event.id });
        }}
        loading={deleteEvent.isPending}
      />
    </>
  );
}
