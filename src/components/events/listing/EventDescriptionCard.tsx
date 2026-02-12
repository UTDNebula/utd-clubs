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
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const showImageTrigger = !!event.image && !imgError;

  return (
    <>
      <Panel className="!p-10 text-slate-700" id={id}>
        {showImageTrigger && (
          <button
            onClick={() => setOpen(true)}
            className={`w-fit max-h-64 mx-auto mb-6 cursor-zoom-in ${
              imgLoaded ? 'block' : 'hidden' // hide button until loaded
            }`}
          >
            <Image
              src={`${event.image!}?v=${event.updatedAt.getTime()}`}
              alt="Event poster"
              height={256}
              width={512}
              className="rounded-lg max-h-64 w-fit object-contain object-center"
              onError={() => setImgError(true)}
              onLoad={() => setImgLoaded(true)}
              priority // ensure fetch even when hidden
            />
          </button>
        )}
        <ExpandableMarkdownText
          text={
            event.description.length > 0
              ? event.description
              : 'No description provided'
          }
          maxLines={10}
        />
      </Panel>
      {showImageTrigger && (
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
              src={`${event.image!}?v=${event.updatedAt.getTime()}`}
              alt="Event poster fullscreen"
              fill
              unoptimized
              className="object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
