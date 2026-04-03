import { type Metadata } from 'next';
import ClubEventHeader from '@src/components/club/listing/ClubEventHeader';
import EventBody from '@src/components/events/listing/EventBody';
import EventTitle from '@src/components/events/listing/EventTitle';
import { EventHeader } from '@src/components/header/Header';
import { api } from '@src/trpc/server';
import { convertMarkdownToPlaintext } from '@src/utils/markdown';

type Params = { params: Promise<{ id: string }> };

export default async function EventsPage(props: Params) {
  const params = await props.params;
  const event = await api.event.getListingInfo({ id: params.id });

  if (!event) return <div>Event Not Found.</div>;

  return (
    <>
      <EventHeader />
      <main className="mb-5 flex flex-col gap-y-8 p-4 max-w-6xl mx-auto">
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

  const event = await api.event.byId({ id: params.id });
  if (!event)
    return {
      title: 'Event not found',
      description: 'Event not found',
    };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const startStr = event.startTime.toLocaleString('en-US', dateOptions);
  const endStr = event.endTime.toLocaleString('en-US', dateOptions);

  let cleanDescription = `${event.name} from ${event.club.name} on UTD Clubs`;
  const textDescription = event.description.replace(/^#+.*$/gm, '');

  // show first paragraph if it's long enough. Otherwise show the entire description
  if (textDescription.length > 0) {
    const firstParagraph = textDescription.split('\n')[0];
    if (firstParagraph) {
      const plainFirstParagraph = convertMarkdownToPlaintext(firstParagraph);
      cleanDescription =
        plainFirstParagraph.length > 60
          ? plainFirstParagraph
          : convertMarkdownToPlaintext(textDescription);
    }
  }

  const timeDescription = `${startStr} - ${endStr}${event.location ? ` | ${event.location}` : ''}`;

  return {
    title: event.name,
    description: `${timeDescription}. ${cleanDescription}`,
    alternates: {
      canonical: `https://clubs.utdnebula.com/events/${event.id}`,
    },
    openGraph: {
      title: event.name,
      url: `https://clubs.utdnebula.com/events/${event.id}`,
      description: `${timeDescription}. ${cleanDescription}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
