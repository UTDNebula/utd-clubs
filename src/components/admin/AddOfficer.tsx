'use client';

import { api } from '@src/trpc/react';
import { UserSearchBar } from '../searchBar/UserSearchBar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type OfficerState = {
  id: string;
  name: string;
  role: 'President' | 'Officer' | 'Member';
};

export default function AddOfficer({ clubId }: { clubId: string }) {
  const { mutate } = api.admin.addOfficer.useMutation({
    onSuccess: () => {
      router.refresh();
      setToAdd(null);
    },
  });
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
        <button
          className="rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (!toAdd) return;
            mutate({ clubId, officerId: toAdd.id, role: toAdd.role });
          }}
          disabled={!toAdd || !toAdd.id || !toAdd.role}
        >
          Add
        </button>
        {toAdd && toAdd.id !== '' && toAdd.name !== '' && (
          <span
            className="text-bold
            ml-3
          "
          >
            Adding <strong>{toAdd.name}</strong> as{' '}
            <strong>{toAdd.role}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
