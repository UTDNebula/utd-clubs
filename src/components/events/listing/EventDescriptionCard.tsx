'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, IconButton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import ExpandableMarkdownText from '@src/components/ExpandableMarkdownText';
import { RouterOutputs } from '@src/trpc/shared';

type EventDescriptionCardProps = {
  event: NonNullable<RouterOutputs['event']['getListingInfo']>;
  id?: string;
};

export default function EventDescriptionCard({
  event,
  id,
}: EventDescriptionCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Panel className="!p-10 text-slate-700" id={id}>
        {event.image && (
          <button
            onClick={() => setOpen(true)}
            className="w-fit max-h-64 mx-auto mb-6 cursor-zoom-in"
          >
            <Image
              src={event.image}
              alt="Event poster"
              height={256}
              width={512}
              className="rounded-lg max-h-64 w-fit object-contain object-center"
            />
          </button>
        )}
        <ExpandableMarkdownText
          text={
            event.description.length > 0
              ? event.description
              : '**Check us out!**'
          }
          maxLines={10}
        />
      </Panel>
      {event.image && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullScreen
          slotProps={{
            paper: {
              sx: {
                backgroundColor: 'rgba(0,0,0,0.9)',
              },
            },
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white z-10"
          >
            <CloseIcon />
          </IconButton>
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={event.image}
              alt="Event poster fullscreen"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
