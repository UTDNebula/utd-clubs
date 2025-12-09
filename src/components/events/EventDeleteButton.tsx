'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SelectEvent } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

export default function EventDeleteButton({
  isHeader,
  event,
}: {
  isHeader?: boolean;
  event: SelectEvent;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const api = useTRPC();
  const { mutate } = useMutation(
    api.event.delete.mutationOptions({
      onSuccess: () => {
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
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permenantly delete <b>{event.name}</b>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              mutate({ id: event.id });
              setOpen(false);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
