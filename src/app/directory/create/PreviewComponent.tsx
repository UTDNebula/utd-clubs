'use client';

import { Button } from '@mui/material';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownText from '@src/components/MarkdownText';
import { logo } from '@src/icons/ContactIcons';
import { contactNames } from '@src/server/db/schema/contacts';

type Officer = {
  id?: string;
  name: string;
  position?: string;
  president?: boolean;
  locked?: boolean;
};

type Contact = {
  platform: string;
  url?: string;
};

type CreateClubSchema = {
  name?: string;
  description?: string;
  officers?: Officer[];
  contacts?: Contact[];
};

type PreviewComponentProps = {
  formData: CreateClubSchema;
};

const EmailButton = ({ item }: { item: Contact }) => {
  return (
    <button className="group relative h-min self-center rounded-full bg-slate-100 p-2.5 transition-colors hover:color-red-100">
      <Link href={`mailto:${item.url}`}>
        <div className="relative h-8 w-8">{logo[item.platform as keyof typeof logo]}</div>
      </Link>
    </button>
  );
};

const ContactButtons = ({ contacts }: { contacts: Contact[] }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {contacts.map((item, index) => (
        <div key={item.url || index}>
          {item.platform === 'email' ? (
            <Tooltip title="Email">
              <EmailButton item={item} />
            </Tooltip>
          ) : (
            <Tooltip title={contactNames[item.platform as keyof typeof contactNames]}>
              <button className="group relative h-min self-center rounded-full bg-slate-100 p-2.5 transition-colors">
                <Link href={item.url || '#'} target="_blank">
                  <div className="relative h-8 w-8">
                    {logo[item.platform as keyof typeof logo]}
                  </div>
                </Link>
              </button>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

const PreviewComponent = ({ formData }: PreviewComponentProps) => {
  const contacts = formData.contacts || [];
  const officers = formData.officers || [];
  const clubName = formData.name || 'Organization Name';

  return (
    <div className="flex flex-col space-y-4">
      {/* ClubHeader */}
      <div className="relative">
        <div className="h-full w-full">
          <Image
            src={'/images/wideWave.jpg'}
            alt="Picture of the club"
            style={{
              width: '100%',
              height: 'auto',
            }}
            height={150}
            width={450}
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <div className="absolute top-0 left-0 flex h-full w-full items-center p-4 md:p-20">
          <h1
            className={`font-display font-bold text-slate-100 ${
              clubName.length > 10 ? 'text-3xl' : 'text-5xl'
            }`}
          >
            {clubName}
          </h1>
          <div className="ml-auto flex items-center gap-x-6">
            <Button variant="contained" size="large" className="normal-case">
              Join
            </Button>
          </div>
        </div>
      </div>

      {/* ClubInfoSegment */}
      <section className="w-full rounded-lg bg-slate-100 p-10 flex flex-col items-start justify-between md:flex-row gap-4">
        <div>
          <div className="flex flex-wrap gap-1 mt-2">
            {/* Tags would go here if available in form data */}
          </div>
        </div>
        <div className="w-full md:w-2/3 text-slate-700">
          <MarkdownText text={formData.description || 'Description goes here'} />
        </div>
        {officers.length > 0 && (
          <div className="w-auto max-w-[320px] min-w-0">
            <h3 className="text-center text-2xl font-medium">Leadership</h3>
            <div className="flex flex-col justify-center align-middle">
              {officers.map((officer, index) => (
                <div className="mt-5 flex flex-row" key={officer.id || index}>
                  <div className="mx-5 flex flex-col justify-center align-middle">
                    <p className="text-left text-sm break-words whitespace-normal text-slate-600">
                      {officer.name}
                    </p>
                    {officer.position && (
                      <p className="mt-2 text-sm break-words whitespace-normal text-slate-400">
                        {officer.position}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ContactInformation */}
      {contacts.length > 0 && (
        <div className="w-full rounded-lg bg-cornflower-50 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <h2 className="text-2xl font-semibold text-cornflower-700">
              Contact Information
            </h2>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <ContactButtons contacts={contacts} />
            </div>
          </div>
        </div>
      )}

      {/* ClubUpcomingEvents */}
      <div className="w-full rounded-lg bg-slate-100 p-6 md:p-10">
        <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
        <div className="mt-4 md:mt-6 group flex flex-wrap w-full justify-evenly items-center gap-4">
          <div className="text-md font-medium text-gray-700">
            There are no upcoming events
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewComponent;