'use client';

import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Panel from '@src/components/form/Panel';
import { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

type Props = { status: 'approved' | 'pending' | 'rejected'; club: SelectClub };

export default function ChangeClubStatus({ status: initial, club }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Props['status']>(initial);
  const api = useTRPC();
  const changeClubStatus = useMutation(
    api.admin.changeClubStatus.mutationOptions({
      onSuccess: () => router.refresh(),
    }),
  );

  function onChange(e: SelectChangeEvent) {
    switch (e.target.value) {
      case 'approved':
        changeClubStatus.mutate({ clubId: club.id, status: 'approved' });
        setStatus('approved');
        break;
      case 'pending':
        changeClubStatus.mutate({ clubId: club.id, status: 'pending' });
        setStatus('pending');
        break;
      case 'rejected':
        changeClubStatus.mutate({ clubId: club.id, status: 'rejected' });
        setStatus('rejected');
        break;
    }
  }

  const statusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-200 text-green-800';
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'rejected':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <Panel heading="Status">
      <div className="ml-2 mb-4 text-slate-600 text-sm">
        <p>
          Pending and rejected organizations are not shown anywhere on UTD
          Clubs.
        </p>
      </div>
      <div className="m-2 mt-0 flex flex-col gap-4">
        <FormControl fullWidth>
          <InputLabel id="change-club-status-label">Status</InputLabel>
          <Select
            labelId="change-club-status-label"
            value={status}
            label="Status"
            onChange={onChange}
            className={statusColor()}
          >
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Alert severity="info">
          {club.soc
            ? 'This organization is originally from SOC.'
            : 'This organization was created on UTD Clubs.'}
        </Alert>
      </div>
    </Panel>
  );
}
