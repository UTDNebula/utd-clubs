import { EventFormSkeleton } from '@src/components/events/EventForm';
import ManageHeader from '@src/components/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Events', 'Create']} />
      <EventFormSkeleton />
    </>
  );
}
