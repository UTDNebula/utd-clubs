'use client';

import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function EventEditButton({
  clubId,
  eventId,
}: {
  clubId: string;
  eventId: string;
}) {
  const router = useRouter();
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/manage/${clubId}/edit/${eventId}`);
      }}
    >
      <EditIcon />
    </IconButton>
  );
}
