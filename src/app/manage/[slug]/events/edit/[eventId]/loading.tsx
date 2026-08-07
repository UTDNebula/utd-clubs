import { EventFormSkeleton } from '@/systems/events/EventForm';
import ManageHeader from '@/systems/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Events', 'loading', 'Edit']} />
      <EventFormSkeleton />
    </>
  );
}
