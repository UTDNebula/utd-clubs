import { Button, Chip } from '@mui/material';
import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ClubEventHeader from '@src/components/club/listing/ClubEventHeader';
import { BaseCard } from '@src/components/common/BaseCard';
import EventDeleteButton from '@src/components/events/EventDeleteButton';
import EventEditButton from '@src/components/events/EventEditButton';
import EventRegisterButton from '@src/components/events/EventRegisterButton';
import EventBody from '@src/components/events/listing/EventBody';
import EventTitle from '@src/components/events/listing/EventTitle';
import { EventHeader } from '@src/components/header/BaseHeader';
import MarkdownText from '@src/components/MarkdownText';
import { db } from '@src/server/db';
import { api } from '@src/trpc/server';
import CountdownTimer from './CountdownTimer';
import TimeComponent from './TimeComponent';

type Params = { params: Promise<{ id: string }> };

export default async function EventsPage(props: Params) {
  const params = await props.params;
  const event = await api.event.getListingInfo({ id: params.id });

  if (!event) return <div>Event Not Found.</div>;

  return (
    <>
      <EventHeader />
      <main className="mb-5 flex flex-col gap-y-6 p-4 max-w-6xl mx-auto">
        <ClubEventHeader club={event.club} />
        <EventTitle event={event} />
        <EventBody event={event} />
      </main>
    </>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  const found = await db.query.events.findFirst({
    where: (events) => eq(events.id, id),
    with: { club: true },
  });
  if (!found)
    return {
      title: 'Event not found',
      description: 'Event not found',
    };

  return {
    title: `${found.name}`,
    description: `${found.name} from ${found.club.name} on UTD Clubs`,
    alternates: {
      canonical: `https://clubs.utdnebula.com/events/${found.id}`,
    },
    openGraph: {
      url: `https://clubs.utdnebula.com/events/${found.id}`,
      description: `${found.name} from ${found.club.name} on UTD Clubs`,
    },
  };
}
