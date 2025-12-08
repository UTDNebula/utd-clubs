'use client';

import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function EventEditButton({
  isHeader,
  clubId,
  eventId,
}: {
  isHeader?: boolean;
  clubId: string;
  eventId: string;
}) {
  return (
    <Link href={`/manage/${clubId}/events/edit/${eventId}`}>
      <Button
        variant="contained"
        size={isHeader ? 'large' : 'small'}
        className="normal-case"
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
    </Link>
  );
}
