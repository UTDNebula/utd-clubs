import Panel from '@src/components/common/Panel';
import { RouterOutputs } from '@src/trpc/shared';
import ContactButton from './ContactButton';

type ClubContactCardProps = {
  club:
    | NonNullable<RouterOutputs['club']['getDirectoryInfo']>
    | NonNullable<RouterOutputs['event']['getListingInfo']>['club'];
  id?: string;
};

export default function ClubContactCard({ club, id }: ClubContactCardProps) {
  return (
    <Panel id={id} smallPadding heading="Contact">
      {club.contacts && club.contacts.length > 0 ? (
        club.contacts.map((contact) => (
          <ContactButton key={contact.platform} contact={contact} />
        ))
      ) : (
        <span className="text-slate-600 dark:text-slate-400 text-sm">
          No contact info
        </span>
      )}
    </Panel>
  );
}
