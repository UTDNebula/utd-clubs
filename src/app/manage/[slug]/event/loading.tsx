import { EventManageHeaderSkeleton } from '@/systems/manage/events/EventManageHeader';
import { DetailsSkeleton } from '@/systems/manage/events/forms/Details';

// Shown on first load, while [eventId]/layout.tsx is still fetching the event for the header
export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-y-6">
      <EventManageHeaderSkeleton />
      <DetailsSkeleton />
    </div>
  );
}
