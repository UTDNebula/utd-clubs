import { and, eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import RegisterButton from '@src/app/event/[id]/RegisterButton';
import { EventHeader } from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { db } from '@src/server/db';
import CountdownTimer from './CountdownTimer';
import TimeComponent from './TimeComponent';

type Params = { params: Promise<{ id: string }> };

export default async function EventsPage(props: Params) {
  const params = await props.params;
  const session = await getServerAuthSession();
  const res = await db.query.events.findFirst({
    where: (events) => eq(events.id, params.id),
    with: { club: true },
  });

  if (!res) return <div>Event Not Found.</div>;

  const { club, ...event } = res;

  const isRegistered =
    (session &&
      (await db.query.userMetadataToEvents.findFirst({
        where: (userMetadataToEvents) =>
          and(
            eq(userMetadataToEvents.eventId, event.id),
            eq(userMetadataToEvents.userId, session.user.id),
          ),
      })) !== undefined) ||
    false;

  const clubDescription = ['Club', 'Location', 'Multi-Day'];
  const clubDetails = [club.name, event.location, 'No'];

  return (
    <main className="w-full">
      <EventHeader />
      <section className="px-7">
        <section className="mb-5 flex flex-col space-y-6">
          <div className="relative flex h-full w-full flex-col justify-between gap-4 rounded-xl bg-[url('/images/wideWave.jpg')] bg-cover p-10 shadow-lg md:flex-row md:gap-0">
            <section className="text-white">
              <div className="flex">
                {club.tags.map((tag) => (
                  <p key={tag} className="mr-5 pt-4 pb-12 font-semibold">
                    {tag}
                  </p>
                ))}
              </div>
              <h1 className="mb-4 text-4xl font-bold">{event.name}</h1>
              <TimeComponent date={event.startTime.toISOString()} />
            </section>
            <section className="flex md:float-right md:my-auto">
              {session && (
                <RegisterButton
                  eventId={event.id}
                  isRegistered={isRegistered}
                />
              )}
            </section>
          </div>
        </section>
        <section className="mb-5 flex flex-col space-y-6 rounded-xl bg-slate-100 p-5 text-black shadow-lg md:flex-row md:p-10">
          <div className="h-full max-w-sm lg:min-w-fit">
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
            <div className="mt-10 flex flex-col space-y-2 md:space-y-5">
              <h1 className="text-md font-semibold text-gray-700 md:text-sm">
                Description
              </h1>
              {clubDescription.map((details, index) => (
                <div
                  key={details}
                  className="flex justify-between text-sm text-slate-700 md:text-xs"
                >
                  <p className="mr-5">{details}</p>
                  <p className="text-right font-semibold">
                    {clubDetails[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grow text-sm md:mx-12">
            <p className="mt-4 whitespace-pre-wrap text-gray-500">
              {event.description}
            </p>
          </div>
          <div className="flex flex-col">
            <CountdownTimer startTime={event.startTime} />
            <Link
              href={`/directory/${club.slug}`}
              className="border-royal text-royal mt-auto mr-8 block w-36 rounded-full border-2 py-4 text-center text-xs font-extrabold break-normal transition-colors hover:bg-blue-700 hover:text-white"
            >
              View Club
            </Link>
          </div>
        </section>
      </section>
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
