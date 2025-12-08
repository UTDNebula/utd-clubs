import { Button, Chip } from '@mui/material';
import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import EventRegisterButton from '@src/components/events/EventRegisterButton';
import { EventHeader } from '@src/components/header/BaseHeader';
import MarkdownText from '@src/components/MarkdownText';
import { db } from '@src/server/db';
import { api } from '@src/trpc/server';
import CountdownTimer from './CountdownTimer';
import TimeComponent from './TimeComponent';

type Params = { params: Promise<{ id: string }> };

export default async function EventsPage(props: Params) {
  const params = await props.params;
  const res = await db.query.events.findFirst({
    where: (events) => eq(events.id, params.id),
    with: { club: true },
  });

  if (!res) return <div>Event Not Found.</div>;

  const { club, ...event } = res;

  const memberType = await api.club.memberType({ id: club.id });

  const src = event.image ?? club.profileImage;

  const clubDescription = ['Club', 'Location', 'Multi-Day'];
  const clubDetails = [club.name, event.location, 'No'];

  return (
    <>
      <EventHeader />
      <main className="mb-5 flex flex-col space-y-4 p-4">
        <section className="relative max-h-48 rounded-lg overflow-hidden">
          <Image
            src={club.bannerImage ?? '/images/wideWave.jpg'}
            alt={club.name + ' banner'}
            height={150}
            width={450}
            className="w-full object-cover object-center"
          />
          <div className="absolute inset-0 flex h-full w-full items-center p-4 md:p-20">
            <div className="flex flex-col gap-4">
              <h1
                className={`font-display font-bold text-slate-100 text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)] ${
                  event.name.length > 10 ? 'text-3xl' : 'text-5xl'
                }`}
              >
                {event.name}
              </h1>
              <TimeComponent date={event.startTime.toISOString()} />
            </div>
            <div className="ml-auto flex items-center gap-x-6">
              {memberType === 'Officer' || memberType === 'President' ? (
                <Link href={`/manage/${club.id}/events/edit/${event.id}`}>
                  <Button
                    variant="contained"
                    size="large"
                    className="normal-case"
                  >
                    Edit
                  </Button>
                </Link>
              ) : (
                <EventRegisterButton isHeader eventId={event.id} />
              )}
            </div>
          </div>
        </section>
        <section className="w-full rounded-lg bg-slate-100 p-10 flex flex-col items-start justify-between md:flex-row gap-4">
          <div>
            {src && (
              <Image
                src={src}
                alt={event.image ? `${event.name} promo` : `${club.name} logo`}
                width={100}
                height={100}
                className="mb-5 rounded-lg"
              />
            )}
            {clubDescription.map((details, index) => (
              <div key={details} className="mt-2 flex w-36 justify-between">
                <p className="text-sm text-slate-400">{details}</p>
                <p className="text-right text-sm text-slate-600">
                  {clubDetails[index]}
                </p>
              </div>
            ))}
            <div className="flex flex-wrap gap-1 mt-2">
              {club.tags.map((tag) => {
                return (
                  <Chip
                    label={tag}
                    key={tag}
                    className=" rounded-full font-bold transition-colors text-white"
                    color="primary"
                  />
                );
              })}
            </div>
          </div>
          <div className="grow text-slate-700">
            <MarkdownText text={event.description} />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <CountdownTimer startTime={event.startTime} />
            </div>
            <Link href={`/directory/${club.slug}`} className="mt-auto self-end">
              <Button variant="contained" className="normal-case" size="large">
                View Club
              </Button>
            </Link>
          </div>
        </section>
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
      canonical: `https://clubs.utdnebula.com/event/${found.id}`,
    },
    openGraph: {
      url: `https://clubs.utdnebula.com/event/${found.id}`,
      description: `${found.name} from ${found.club.name} on UTD Clubs`,
    },
  };
}
