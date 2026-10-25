import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import type { ReactNode } from 'react';
import BackButton from '@/lib/components/BackButton';

type PathItem = { text: string; href?: string };

type ParticipantHeaderProps = {
  event: { id: string; name: string };
  path?: PathItem[];
  hrefBack?: string;
  children?: ReactNode;
};

const ParticipantHeader = ({
  event,
  path = [],
  hrefBack,
  children,
}: ParticipantHeaderProps) => (
  <div className="mb-8 flex w-full flex-row flex-wrap items-center gap-x-10 gap-y-2">
    <div className="flex min-h-10.5 flex-row items-center gap-2">
      <BackButton href={hrefBack} />
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/events">Events</Link>
        <Link href={`/events/${event.id}`} className="font-bold">
          {event.name}
        </Link>
        {path.map(({ text, href }) =>
          href ? (
            <Link key={text} href={href}>
              {text}
            </Link>
          ) : (
            <Typography key={text}>{text}</Typography>
          ),
        )}
      </Breadcrumbs>
    </div>
    {children}
  </div>
);

export default ParticipantHeader;
