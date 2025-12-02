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
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

export default function DeleteButton() {
  const api = useTRPC();
  const { mutate } = useMutation(
    api.userMetadata.deleteById.mutationOptions({
      onSuccess: async () => await authClient.signOut(),
    }),
  );
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        className="normal-case"
        onClick={() => setOpen(true)}
      >
        Delete Account
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear all your account data and remove it from the
            platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => mutate()}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
