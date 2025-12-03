'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { type RouterOutputs } from '@src/trpc/shared';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@src/trpc/react';

export default function EventDeleteButton({
  event,
}: {
  event: RouterOutputs['event']['byClubId'][number];
}) {
  const [open, setOpen] = useState(false);

  const api = useTRPC();
  const { mutate } = useMutation(
    api.event.delete.mutationOptions(),
  );

  return (
    <>
      <IconButton color="error" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true)
      }}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permenantly delete {event.name}.
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
