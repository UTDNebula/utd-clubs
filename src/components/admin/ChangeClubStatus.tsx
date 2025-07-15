'use client';

import { api } from '@src/trpc/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = { status: 'approved' | 'pending' | 'rejected'; clubId: string };

export default function ChangeClubStatus({ status: initial, clubId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Props['status']>(initial);
  const { mutate } = api.admin.changeClubStatus.useMutation({
    onSuccess: () => router.refresh(),
  });

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
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
      <select
        className={`rounded-lg border-2 border-gray-300 p-2 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-hidden ${statusColor()}`}
        value={status}
        onChange={onChange}
      >
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
}
