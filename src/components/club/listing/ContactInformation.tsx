import { BaseCard } from '@src/components/common/BaseCard';
import type {
  SelectContact as Contacts,
  SelectClub,
} from '@src/server/db/models';
import ContactButtons from './ContactButtons';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};

const ContactInformation = ({ club }: { club: Club }) => {
  return (
    <BaseCard className="w-full bg-cornflower-50 p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <h2 className="text-2xl font-semibold text-cornflower-700">
          Contact Information
        </h2>

        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <ContactButtons contacts={club.contacts || []} />
        </div>
      </div>
    </BaseCard>
  );
};

export default ContactInformation;
