import { EventFormSkeleton } from '@src/systems/events/EventForm';
import ManageHeader from '@src/systems/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Events', 'loading', 'Edit']} />
      <EventFormSkeleton />
    </>
  );
}
