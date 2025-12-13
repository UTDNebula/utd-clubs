'use client';

import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function EventEditButton({
  isHeader,
  clubSlug,
  eventId,
}: {
  isHeader?: boolean;
  clubSlug: string;
  eventId: string;
}) {
  return (
    <Link href={`/manage/${clubSlug}/events/edit/${eventId}`}>
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
