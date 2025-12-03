'use client';

import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';

type Props = { status: 'approved' | 'pending' | 'rejected'; clubId: string };

export default function ChangeClubStatus({ status: initial, clubId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Props['status']>(initial);
  const api = useTRPC();
  const { mutate } = useMutation(
    api.admin.changeClubStatus.mutationOptions({
      onSuccess: () => router.refresh(),
    }),
  );

  function onChange(e: SelectChangeEvent) {
    switch (e.target.value) {
      case 'approved':
        mutate({ clubId: clubId, status: 'approved' });
        setStatus('approved');
        break;
      case 'pending':
        mutate({ clubId: clubId, status: 'pending' });
        setStatus('pending');
        break;
      case 'rejected':
        mutate({ clubId: clubId, status: 'rejected' });
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
    <div className="flex">
      <Select value={status} onChange={onChange} className={statusColor()}>
        <MenuItem value="approved">Approved</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
      </Select>
    </div>
  );
}
