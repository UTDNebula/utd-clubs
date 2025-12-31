import { BaseCard } from '@src/components/common/BaseCard';
import { RouterOutputs } from '@src/trpc/shared';
import ContactButton from './ContactButton';

type ClubContactCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
};

export default function ClubContactCard({ club }: ClubContactCardProps) {
  return (
    <BaseCard className="flex flex-col bg-neutral-50 shadow-sm p-5 gap-2">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Contact</h2>
      {club.contacts && club.contacts.length > 0 ? (
        club.contacts.map((contact) => (
          <ContactButton key={contact.platform} contact={contact} />
        ))
      ) : (
        <span className="text-slate-500 text-sm">No contact info</span>
      )}
    </BaseCard>
  );
}
