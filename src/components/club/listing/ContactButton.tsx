import { Button, Tooltip } from '@mui/material';
import Link from 'next/link';
import { logo } from '@src/icons/ContactIcons';
import type { SelectContact } from '@src/server/db/models';
import { contactNames } from '@src/server/db/schema/contacts';

function contactDisplay(contact: SelectContact) {
  switch (contact.platform) {
    case 'discord':
      return (
        contact.url.split('://')[1]?.replace('www.', '').replace(/\/+$/, '') ??
        contactNames[contact.platform]
      );
    case 'instagram':
      return contact.url.indexOf('instagram.com/') >= 0
        ? '@' +
            contact.url
              .split('instagram.com/')[1]!
              .replace(/\/+$/, '')
              .split(/[/?#]/)[0]
        : contactNames[contact.platform];
    case 'website':
      return contact.url
        .replace('http://', '')
        .replace('https://', '')
        .replace('www.', '')
        .replace(/\/+$/, '');
    case 'email':
      return contact.url;
    case 'twitter':
      return contact.url.indexOf('.com/') > 0
        ? '@' +
            contact.url.split('.com/')[1]!.replace(/\/+$/, '').split(/[/?#]/)[0]
        : contactNames[contact.platform];
    case 'facebook':
      return contact.url.indexOf('.com/') > 0
        ? '@' +
            contact.url.split('.com/')[1]!.replace(/\/+$/, '').split(/[/?#]/)[0]
        : contactNames[contact.platform];
    case 'youtube':
      return contact.url.indexOf('youtube.com/@') >= 0
        ? contact.url
            .split('youtube.com/')[1]!
            .replace(/\/+$/, '')
            .split(/[/?#]/)[0]
        : contactNames[contact.platform];
    case 'twitch':
      return (
        contact.url
          .split('twitch.tv/')[1]
          ?.replace(/\/+$/, '')
          .split(/[/?#]/)[0] ?? contactNames[contact.platform]
      );
    case 'linkedIn':
      return contactNames[contact.platform];
    case 'other':
      return contactNames[contact.platform];
    default:
      return contact.platform;
  }
}

type ContactButtonProps = {
  contact: SelectContact;
};
const ContactButton = ({ contact }: ContactButtonProps) => {
  return (
    <Tooltip
      key={contact.platform + contact.url}
      title={contactNames[contact.platform]}
    >
      <Link
        href={
          contact.platform === 'email' ? `mailto:${contact.url}` : contact.url
        }
        target="_blank"
      >
        <Button
          variant="contained"
          className="normal-case bg-white hover:bg-slate-100 shadow-sm w-full text-black font-normal justify-start pl-3 pr-1"
          startIcon={logo[contact.platform]}
          size="large"
        >
          <span className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
            {contactDisplay(contact)}
          </span>
        </Button>
      </Link>
    </Tooltip>
  );
};

export default ContactButton;
