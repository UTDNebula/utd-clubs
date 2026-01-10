'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Confirmation from '@src/components/Confirmation';
import { SelectEvent } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

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

  return (
    <>
      <Button
        variant="contained"
        color="error"
        size={isHeader ? 'large' : 'small'}
        className="normal-case"
        startIcon={<DeleteIcon />}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        Delete
      </Button>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        contentText={
          <>
            This will permenantly delete <b>{event.name}</b>.
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
