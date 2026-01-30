'use client';

import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import Link from 'next/link';
import { getGcalEventLink } from '@src/modules/googleCalendar';

export default function EventEditButton({
  isHeader,
  clubSlug,
  eventId,
  calendarId,
  userEmail,
  fromGoogle,
}: {
  isHeader?: boolean;
  clubSlug: string;
  eventId: string;
  calendarId: string | null;
  userEmail: string;
  fromGoogle: boolean;
}) {
  return (
    <Button
      LinkComponent={Link}
      href={
        fromGoogle
          ? getGcalEventLink(eventId, calendarId, userEmail)
          : `/manage/${clubSlug}/events/edit/${eventId}`
      }
      {...(fromGoogle && { target: '_blank', rel: 'noopener noreferrer' })}
      variant="contained"
      size={isHeader ? 'large' : 'small'}
      className={`normal-case ${isHeader ? 'bg-white hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800' : 'bg-white hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'} text-haiti dark:text-white`}
      startIcon={<EditIcon />}
    >
      Edit
    </Button>
  );
}
