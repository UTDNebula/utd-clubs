'use client';

import { InfoOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';

export default function ClubMatchFormGenderDisclaimer() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Gender Identity Disclaimer">
        <IconButton
          aria-label="Gender Identity Disclaimer"
          onClick={handleOpen}
          size="small"
          color="inherit"
        >
          <InfoOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Gender Identity Disclaimer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We ask this question to help match you to clubs for people of your
            gender identity. If you don&apos;t want gender identity to be
            factored into your matching, you don&apos;t have to provide it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" autoFocus>
            Got It
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
