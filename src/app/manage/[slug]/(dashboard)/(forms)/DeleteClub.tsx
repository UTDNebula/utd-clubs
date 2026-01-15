'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import Confirmation from '@src/components/Confirmation';
import { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

type Props = { view: 'manage' | 'admin'; club: SelectClub };

export default function DeleteClub({ view, club }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const api = useTRPC();
  let apiProcedure = null;
  switch (view) {
    case 'admin':
      apiProcedure = api.admin.deleteClub;
      break;
    case 'manage':
      switch (club.approved) {
        case 'approved':
          apiProcedure = api.club.edit.markDeleted;
          break;
        case 'pending':
        case 'rejected':
          apiProcedure = api.club.edit.delete;
          break;
        case 'deleted':
          apiProcedure = api.club.edit.restore;
          break;
      }
      break;
  }
  const mutateClub = useMutation(
    apiProcedure.mutationOptions({
      onSuccess: () => {
        if (view === 'admin') {
          router.push('/admin/clubs');
        } else if (
          club.approved === 'pending' ||
          club.approved === 'rejected'
        ) {
          router.push('/manage');
        } else {
          setOpen(false);
          router.refresh();
        }
      },
    }),
  );

  return (
    <>
      <Panel
        heading={
          view === 'manage' && club.approved === 'deleted'
            ? 'Restore'
            : 'Delete'
        }
        className="bg-red-100 border border-red-500"
      >
        <div className="ml-2 mb-4 text-slate-800 text-sm">
          {view === 'admin' && (
            <p>
              This will permenantly delete this organization from UTD Clubs.
            </p>
          )}
          {view === 'manage' && club.approved === 'approved' && (
            <>
              <p>
                This will mark your organization as pending deletion from UTD
                Clubs.
              </p>
              <p>
                A UTD Clubs admin will review your request and delete it
                permanently.
              </p>
            </>
          )}
          {view === 'manage' &&
            (club.approved === 'pending' || club.approved === 'rejected') && (
              <p>
                This will permenantly delete your organization from UTD Clubs.
              </p>
            )}
          {view === 'manage' && club.approved === 'deleted' && (
            <p>This will restore your organization from pending deletion.</p>
          )}
        </div>
        <div className="m-2 mt-0">
          <Button
            variant="contained"
            className="normal-case"
            color="error"
            startIcon={
              view === 'manage' && club.approved === 'deleted' ? (
                <RestoreFromTrashIcon />
              ) : (
                <DeleteIcon />
              )
            }
            loading={mutateClub.isPending}
            onClick={() => {
              if (view === 'manage' && club.approved === 'deleted') {
                // No confirmation to restore
                mutateClub.mutate({ id: club.id });
              } else {
                setOpen(true);
              }
            }}
          >
            {view === 'manage' && club.approved === 'deleted'
              ? 'Restore Club'
              : 'Delete Club'}
          </Button>
        </div>
      </Panel>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        contentText={
          view === 'manage' && club.approved === 'approved' ? (
            <>
              This will mark <b>{club.name}</b> for permenant deletion.
            </>
          ) : (
            <>
              This will permenantly delete <b>{club.name}</b>.
            </>
          )
        }
        onConfirm={() => {
          mutateClub.mutate({ id: club.id });
        }}
        loading={mutateClub.isPending}
      />
    </>
  );
}
