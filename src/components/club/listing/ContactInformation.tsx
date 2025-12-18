import type {
  SelectContact as Contacts,
  SelectClub,
} from '@src/server/db/models';
import ContactButton from './ContactButton';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};

const ContactInformation = ({ club }: { club: Club }) => {
  return (
    <div className="w-full rounded-lg bg-cornflower-50 p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <h2 className="text-2xl font-semibold text-cornflower-700">
          Contact Information
        </h2>

        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          {/* <ContactButtons contacts={club.contacts || []} /> */}
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
