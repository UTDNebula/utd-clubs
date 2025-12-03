import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { logo } from '@src/icons/ContactIcons';
import type { SelectContact as Contacts } from '@src/server/db/models';

const platformLabel: Record<string, string> = {
  discord: 'Discord',
  instagram: 'Instagram',
  website: 'Website',
  email: 'Email',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
  twitch: 'Twitch',
  linkedIn: 'LinkedIn',
  other: 'Other',
};

const EmailButton = ({ item }: { item: Contacts }) => {
  return (
    <button className="group relative h-min self-center rounded-full bg-slate-100 p-2.5 transition-colors hover:color-red-100">
      <Link href={`mailto:${item.url}`}>
        <div className="relative h-8 w-8">{logo[item.platform]}</div>
      </Link>
    </button>
  );
};

type contentButtonProps = {
  contacts: Array<Contacts>;
};
const ContactButtons = ({ contacts }: contentButtonProps) => {
  return (
    <div className="flex flex-wrap gap-x-4">
      {contacts.map((item) => (
        <div key={item.url}>
          {item.platform === 'email' ? (
            <Tooltip title="Email">
              <EmailButton item={item} />
            </Tooltip>
          ) : (
            <Tooltip title={platformLabel[item.platform]}>
              <button className="group relative h-min self-center rounded-full bg-slate-100 p-2.5 transition-colors">
                <Link href={item.url} target="_blank">
                  <div className="relative h-8 w-8">{logo[item.platform]}</div>
                </Link>
              </button>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactButtons;
