import { RouterOutputs } from '@src/trpc/shared';
import ContactButton from './ContactButton';

type ClubContactCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
};

export default function ClubContactCard({ club }: ClubContactCardProps) {
  return (
    <div className="flex flex-col bg-neutral-50 border-slate-200 shadow-sm  p-5 rounded-xl gap-2">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Contact</h2>
      {club.contacts && club.contacts.length > 0 ? (
        club.contacts.map((contact) => (
          <div
            key={contact.platform}
            className="bg-white shadow-sm rounded-4xl hover:bg-gray-100 transition-colors duration-200"
          >
            <ContactButton contact={contact} />
          </div>
        ))
      ) : (
        <span className="text-slate-500 text-sm">No contact info</span>
      )}
    </div>
  );
}
