import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@src/utils/auth-client';

export default function DeleteButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
            onClick={async () => {
              await authClient.deleteUser();
              router.push('/');
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
