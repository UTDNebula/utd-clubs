import { ReactNode } from 'react';
import EventsTitle from '@src/components/events/directory/EventsTitle';
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
      <main className="mb-5 flex flex-col gap-y-4 sm:px-4 max-w-6xl mx-auto">
        {/* EventsTitle should be in layout.tsx so that it doesn't re-render between pages */}
        <EventsTitle />
        <div className="flex flex-col gap-y-4 max-sm:px-4">{children}</div>
      </main>
    </>
  );
}
