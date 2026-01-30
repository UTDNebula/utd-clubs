import Panel from '@src/components/common/Panel';
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
      <div
        className="flex w-full gap-4 mt-5 items-center 
          flex-nowrap justify-start overflow-x-auto pb-4 px-4
          md:flex-wrap md:justify-evenly md:overflow-visible md:pb-0 md:px-0"
      >
        {membershipForms.length > 0 ? (
          membershipForms.map((form) => (
            <div key={form.id} className="shrink-0">
              <MembershipFormCard form={form} />
            </div>
          ))
        ) : (
          <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-md font-medium text-slate-600 dark:text-slate-400">
            {emptyText}
          </div>
        )}
      </div>
    </Panel>
  );
}
