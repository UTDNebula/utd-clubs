'use client';

import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Confirmation from '@src/components/Confirmation';
import Panel from '@src/components/form/Panel';
import { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

type Props = { club: SelectClub };

export default function DeleteClub({ club }: Props) {
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
      <Panel heading="Delete" className="bg-red-100 border border-red-500">
        <div className="ml-2 mb-4 text-slate-800 dark:text-slate-200 text-sm">
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
      </Panel>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        contentText={
          <>
            This will permenantly delete <b>{club.name}</b>.
          </>
        }
        onConfirm={() => {
          deleteClub.mutate({ id: club.id });
        }}
        loading={deleteClub.isPending}
      />
    </>
  );
}
