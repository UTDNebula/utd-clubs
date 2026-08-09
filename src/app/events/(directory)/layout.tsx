import { ReactNode } from 'react';
import EventsHeader from '@/systems/events/directory/EventsHeader';
import { EventHeader } from '@/lib/modules/navigation/header';

type EventDirectoryLayoutProps = {
  children: ReactNode;
};

export default async function EventDirectoryLayout({
  children,
}: EventDirectoryLayoutProps) {
  return (
    <>
      <EventHeader />
      <main className="mx-auto mb-5 flex max-w-6xl flex-col sm:px-4">
        {/* EventsTitle should be in layout.tsx so that it doesn't re-render between pages */}
        <EventsHeader />
        <div className="flex flex-col gap-y-4 max-sm:px-4">{children}</div>
      </main>
    </>
  );
}
