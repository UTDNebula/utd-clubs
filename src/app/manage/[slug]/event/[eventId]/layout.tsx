import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';
import EventManageHeader from '@/systems/manage/events/EventManageHeader';
import { api } from '@/trpc/server';

/**
 * Shared by every tab of the event manage page (Details, Registration, Attendance).
 * The header lives here so it stays on screen while switching tabs.
 */
const EventManageLayout = async (props: {
  params: Promise<{ slug: string; eventId: string }>;
  children: ReactNode;
}) => {
  const { slug, eventId } = await props.params;

  const event = await api.event.byId({ eventId });
  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-y-6">
      <EventManageHeader slug={slug} eventId={eventId} eventName={event.name} />
      {props.children}
    </div>
  );
};

export default EventManageLayout;
