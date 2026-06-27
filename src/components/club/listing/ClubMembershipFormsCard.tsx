import Panel from '@src/nebula-library/components/Panel';
import MembershipFormCard from '@src/components/MembershipFormCard';
import { RouterOutputs } from '@src/trpc/shared';

type ClubUpcomingEventsCardProps = {
  emptyText: string;
  heading: string;
  membershipForms: NonNullable<RouterOutputs['club']['clubForms']>;
  id?: string;
};

export default function ClubMembershipFormsCard({
  emptyText,
  heading,
  membershipForms,
  id,
}: ClubUpcomingEventsCardProps) {
  return (
    <Panel className="text-sm" id={id} smallPadding heading={heading}>
      <div className="mt-5 flex w-full flex-nowrap items-center justify-start gap-4 overflow-x-auto px-4 pb-4 md:flex-wrap md:justify-evenly md:overflow-visible md:px-0 md:pb-0">
        {membershipForms.length > 0 ? (
          membershipForms.map((form) => (
            <div key={form.id} className="shrink-0">
              <MembershipFormCard form={form} />
            </div>
          ))
        ) : (
          <div className="text-md flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12 font-medium text-slate-600 dark:border-slate-800 dark:text-slate-400">
            {emptyText}
          </div>
        )}
      </div>
    </Panel>
  );
}
