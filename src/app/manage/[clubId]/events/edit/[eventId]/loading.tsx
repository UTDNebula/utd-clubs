import { EventFormSkeleton } from '@src/components/events/EventForm';
import ClubManageHeader from '@src/components/header/ClubManageHeader';

export default function Loading() {
  return (
    <>
      <ClubManageHeader loading path={['Events', 'loading', 'Edit']} />
      <EventFormSkeleton />
    </>
  );
}
