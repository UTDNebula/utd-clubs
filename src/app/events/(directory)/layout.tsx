import { ReactNode } from 'react';
import EventsHeader from '@src/components/events/directory/EventsHeader';
import { EventHeader } from '@src/components/header/Header';

type EventDirectoryLayoutProps = {
  children: ReactNode;
};

export default async function EventDirectoryLayout({
  children,
}: EventDirectoryLayoutProps) {
  return (
    <>
      <EventHeader />
      <main className="mb-5 flex flex-col sm:px-4 max-w-6xl mx-auto">
        {/* EventsTitle should be in layout.tsx so that it doesn't re-render between pages */}
        <EventsHeader />
        <div className="flex flex-col gap-y-4 max-sm:px-4">{children}</div>
      </main>
    </>
  );
}
