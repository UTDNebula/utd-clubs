import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import EventCalendar from '@src/components/community/EventCalendar';
import Header from '@src/components/header/Header';
import { auth } from '@src/server/auth';

export const metadata: Metadata = {
  title: 'My Event Calendar | My Community',
  description: 'View all your registered events in a calendar.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/community/calendar',
  },
  openGraph: {
    title: 'My Event Calendar | My Community',
    url: 'https://clubs.utdnebula.com/community/calendar',
    description: 'View all your registered events in a calendar.',
  },
};

const CalendarPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <>
        <Header />
        <main className="p-4">
          <div className="flex w-full place-content-center items-center pt-20">
            <Image src="/nebula-logo.png" alt="" width={300} height={300} />
          </div>
          <div className="h-full">
            <h1 className="font-display text-black-500 pt-5 pb-1 text-center text-3xl font-bold">
              Please sign in to view your registered events.
            </h1>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 min-h-16 px-4">
          <h1 className="font-display text-2xl font-bold">My Event Calendar</h1>
        </div>
        <div className="mt-4 px-4">
          <EventCalendar />
        </div>
      </main>
    </>
  );
};

export default CalendarPage;
