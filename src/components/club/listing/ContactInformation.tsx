import Image from 'next/image';
import ContactButtons from './ContactButtons';
import type {
  SelectClub,
  SelectContact as Contacts,
} from '@src/server/db/models';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};

const ContactInformation = async ({ club }: { club: Club }) => {
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


      <div className="absolute left-0 top-0 h-full w-full flex items-center justify-between p-6">
        <div className="text-blue-700 font-bold text-2xl">Contact Information</div>
        <ContactButtons contacts={club.contacts || []} />
      </div>
    </div>
  );
}

export default ContactInformation;
