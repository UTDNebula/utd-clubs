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

export default function Disclaimer() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="AI Disclaimer">
        <IconButton
          aria-label="AI Disclaimer"
          onClick={handleOpen}
          size="small"
          color="inherit"
        >
          <InfoOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>AI Disclaimer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Club recommendations are generated using Google&apos;s Gemini AI.
            While we strive for accuracy, AI recommendations may not perfectly
            match your preferences. We recommend reviewing the suggested clubs
            to find the best fit for you.
            <br />
            <br />
            On the results page, if you experience issues with suggestions not
            linking to the club, try searching for it using the search bar
            above.
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
