'use client';

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { type SelectClub } from '@src/server/db/models';

type Props = {
  club: SelectClub;
};
export default function ClubDescription({ club }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        className="normal-case"
        onClick={() => setOpen(true)}
      >
        View Details
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>{club.name}</DialogTitle>
        <DialogContent>
          <div className="flex gap-1 flex-wrap mb-4">
            {club.tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </div>
          <DialogContentText>
            {club.description.split('\n').map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
