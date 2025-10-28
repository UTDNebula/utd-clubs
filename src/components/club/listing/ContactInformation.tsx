import Image from 'next/image';
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
    <div className="relative">
      <div className="h-full w-full">
        <Image
          src={'/images/lightBlue.png'}
          alt="Just some background color"
          style={{
            width: '100%',
            height: '50%',
          }}
          height={100}
          width={450}
          className="rounded-lg object-cover"
          priority
        />
      </div>

      <div className="absolute top-0 left-0 flex h-full w-full items-center justify-between p-6">
        <div className="text-2xl font-bold text-blue-700">
          Contact Information
        </div>
        <ContactButtons contacts={club.contacts || []} />
      </div>
    </div>
  );
};

export default ContactInformation;
