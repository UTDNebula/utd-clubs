'use client';

import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function EventParticipantsButton({
  isHeader,
  eventId,
}: {
  isHeader?: boolean;
  eventId: string;
}) {
  return (
    <Button
      LinkComponent={Link}
      href={`/events/${eventId}/participants`}
      variant="contained"
      size={isHeader ? 'large' : 'small'}
      className={`normal-case ${isHeader ? 'bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700' : 'bg-white hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600'} text-haiti dark:text-white`}
      startIcon={<PersonIcon />}
    >
      Participants
    </Button>
  );
}
