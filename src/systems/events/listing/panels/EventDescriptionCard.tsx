'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, IconButton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import Panel from '@nebula-library/components/Panel';
import ExpandableMarkdownText from '@/lib/components/ExpandableMarkdownText';
import { RouterOutputs } from '@/trpc/shared';
import { addVersionToImage } from '@/lib/utils/imageCacheBust';

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
            aria-label="View full size event poster"
            className={`mx-auto mb-6 max-h-64 w-fit cursor-zoom-in ${
              imgLoaded ? 'block' : 'hidden' // hide button until loaded
            }`}
          >
            <Image
              src={addVersionToImage(event.image!, event.updatedAt.getTime())}
              alt="Event poster"
              height={256}
              width={512}
              className="max-h-64 w-fit rounded-lg object-contain object-center"
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
            aria-label="Close"
            className="absolute top-4 right-4 z-10 text-white"
          >
            <CloseIcon />
          </IconButton>
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={addVersionToImage(event.image!, event.updatedAt.getTime())}
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
