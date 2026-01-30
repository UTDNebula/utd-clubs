'use client';

import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';

const EDIT_ACTION_CLASS =
  'bg-white text-haiti hover:bg-neutral-200 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600';

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
      {isHeader ? (
        <Button
          variant="contained"
          size="large"
          className={`normal-case ${EDIT_ACTION_CLASS}`}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      ) : (
        <Tooltip title="Edit Event">
          <IconButton
            size="small"
            aria-label="Edit Event"
            className={`${EDIT_ACTION_CLASS}`}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </Link>
  );
}
