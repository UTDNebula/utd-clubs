import { DetailsSkeleton } from '@/systems/manage/events/forms/Details';

// Shown below the header (from layout.tsx) while the Details tab loads
export default function Loading() {
  return <DetailsSkeleton />;
}
