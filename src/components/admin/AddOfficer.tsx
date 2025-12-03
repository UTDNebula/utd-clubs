'use client';

import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import { UserSearchBar } from '../searchBar/UserSearchBar';

type OfficerState = {
  id: string;
  name: string;
  role: 'President' | 'Officer' | 'Member';
};

export default function AddOfficer({ clubId }: { clubId: string }) {
  const api = useTRPC();
  const { mutate } = useMutation(
    api.admin.addOfficer.mutationOptions({
      onSuccess: () => {
        router.refresh();
        setToAdd(null);
      },
    }),
  );
  const router = useRouter();
  const [toAdd, setToAdd] = useState<OfficerState | null>(null);

  return (
    <div className="container">
      <h1>Add Officer</h1>
      <div className="flex p-3">
        <UserSearchBar
          passUser={(user) =>
            setToAdd((prev) => ({
              id: user.id,
              role: prev?.role ?? 'Member',
              name: user.name,
            }))
          }
        />
        <select
          value={toAdd?.role ?? 'Member'}
          onChange={(e) =>
            setToAdd((prev) => ({
              id: prev?.id ?? '',
              role: e.target.value as OfficerState['role'],
              name: prev?.name ?? '',
            }))
          }
          className="ml-3 rounded-sm px-4 py-2 font-bold"
        >
          <option value="President">President</option>
          <option value="Officer">Officer</option>
          <option value="Member">Member</option>
        </select>
      </div>
      <div className="flex items-center p-3">
        <Button
          variant="contained"
          className="normal-case"
          onClick={() => {
            if (!toAdd) return;
            mutate({ clubId, officerId: toAdd.id, role: toAdd.role });
          }}
          disabled={!toAdd || !toAdd.id || !toAdd.role}
        >
          Add
        </Button>
        {toAdd && toAdd.id !== '' && toAdd.name !== '' && (
          <span className="text-bold ml-3">
            Adding <strong>{toAdd.name}</strong> as{' '}
            <strong>{toAdd.role}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
