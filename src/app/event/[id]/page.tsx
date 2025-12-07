import { Button, Chip } from '@mui/material';
import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import EventRegisterButton from '@src/components/events/EventRegisterButton';
import { EventHeader } from '@src/components/header/BaseHeader';
import MarkdownText from '@src/components/MarkdownText';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import CountdownTimer from './CountdownTimer';
import TimeComponent from './TimeComponent';

type Params = { params: Promise<{ id: string }> };

export default async function EventsPage(props: Params) {
  const params = await props.params;
  const session = await auth.api.getSession({ headers: await headers() });
  const res = await db.query.events.findFirst({
    where: (events) => eq(events.id, params.id),
    with: { club: true },
  });

  if (!res) return <div>Event Not Found.</div>;

  const { club, ...event } = res;

  const clubDescription = ['Club', 'Location', 'Multi-Day'];
  const clubDetails = [club.name, event.location, 'No'];

  return (
    <main className="w-full">
      <EventHeader />
      <div className="mb-5 flex flex-col space-y-4 px-3">
        <section className="mb-5 relative rounded-xl shadow-lg overflow-hidden">
          <Image
            src={club.bannerImage ?? '/images/wideWave.jpg'}
            alt={club.name + ' banner'}
            fill
            className="object-cover"
          />
          <div className="relative z-10 flex h-full inset-0 flex-col justify-between gap-4 p-10 md:flex-row md:gap-0">
            <div className="text-white">
              <h1 className="font-display mb-4 text-4xl font-bold text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)]">
                {event.name}
              </h1>
              <TimeComponent date={event.startTime.toISOString()} />
            </div>
            <div className="flex md:float-right md:my-auto">
              {session && <EventRegisterButton isHeader eventId={event.id} />}
            </div>
          </div>
        </section>
        <section className="w-full rounded-lg bg-slate-100 p-10 flex flex-col items-start justify-between md:flex-row gap-4">
          <div>
            {club.profileImage && (
              <div className="relative mx-auto h-40 w-full overflow-hidden rounded-b-md">
                <Image
                  src={club.profileImage}
                  alt={club.name + ' logo'}
                  fill
                  className="object-cover"
                />
              </div>
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
          <div className="grow text-sm md:mx-12 text-slate-700 pt-4">
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
      </div>
    </main>
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
