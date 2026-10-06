'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, IconButton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import Panel from '@nebula-library/components/Panel';
import ExpandableMarkdownText from '@/lib/components/ExpandableMarkdownText';
import { addVersionToImage } from '@/lib/utils/imageCacheBust';
import { RouterOutputs } from '@/trpc/shared';

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

  const showImageTrigger = !!event.image && !imgError;

  return (
    <>
      <Panel className="!p-10 text-slate-700" id={id}>
        {showImageTrigger && (
          <button
            onClick={() => setOpen(true)}
            aria-label="View full size event poster"
            className="mx-auto mb-6 max-h-64 w-fit cursor-zoom-in"
          >
            <Image
              src={addVersionToImage(event.image!, event.updatedAt.getTime())}
              alt="Event poster"
              height={256}
              width={512}
              className="max-h-64 w-fit rounded-lg object-contain object-center"
              onError={() => setImgError(true)}
              priority
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
              className: 'flex items-center justify-center',
              onClick: () => setOpen(false),
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

          <Image
            src={addVersionToImage(event.image!, event.updatedAt.getTime())}
            alt="Event poster fullscreen"
            width={512}
            height={256}
            unoptimized
            className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
            onClick={(event) => event.stopPropagation()}
            onError={() => setImgError(true)}
          />
        </Dialog>
      )}
    </>
  );
}
