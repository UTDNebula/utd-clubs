'use client';

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
import FormFieldSet from '@src/components/form/FormFieldSet';
import { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

type Props = { club: SelectClub };

export default function ChangeClubStatus({ club }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const api = useTRPC();
  const deleteClub = useMutation(
    api.admin.deleteClub.mutationOptions({
      onSuccess: () => router.push('/admin/clubs'),
    }),
  );

  return (
    <>
      <FormFieldSet
        legend="Delete"
        className="!bg-red-100 border border-red-500"
      >
        <div className="ml-2 mb-4 text-slate-600 text-sm">
          <p>This will permenantly delete this organization from UTD Clubs.</p>
        </div>
        <div className="m-2 mt-0 flex flex-col gap-4">
          <Button
            variant="contained"
            className="normal-case"
            size="small"
            color="error"
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>
        </div>
      </FormFieldSet>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permenantly delete <b>{club.name}</b>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteClub.mutate({ id: club.id });
            }}
            autoFocus
            loading={deleteClub.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
