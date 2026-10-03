import { EventFormSkeleton } from '@/systems/events/create/EventForm';
import ManageHeader from '@/systems/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Events', 'Create']} />
      <EventFormSkeleton />
    </>
  );
}
