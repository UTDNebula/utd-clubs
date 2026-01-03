import { IconButton, Tooltip } from '@mui/material';
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
        ? '@' + contact.url.split('instagram.com/')[1]!.replace(/\/+$/, '')
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
        ? '@' + contact.url.split('.com/')[1]!.replace(/\/+$/, '')
        : contactNames[contact.platform];
    case 'facebook':
      return contact.url.indexOf('.com/') > 0
        ? '@' + contact.url.split('.com/')[1]!.replace(/\/+$/, '')
        : contactNames[contact.platform];
    case 'youtube':
      return contact.url.indexOf('youtube.com/@') >= 0
        ? contact.url.split('youtube.com/')[1]!.replace(/\/+$/, '')
        : contactNames[contact.platform];
    case 'twitch':
      return (
        contact.url.split('twitch.tv/')[1]?.replace(/\/+$/, '') ??
        contactNames[contact.platform]
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
        className="flex items-center justify-start w-full bg-white shadow-sm rounded-4xl hover:bg-gray-100 transition-colors duration-200 pr-2"
      >
        <IconButton
          className="group hover:bg-inherit flex-shrink-0"
          size="medium"
        >
          {logo[contact.platform]}
        </IconButton>
        <span className="text-sm truncate min-w-0">
          {contactDisplay(contact)}
        </span>
      </Link>
    </Tooltip>
  );
};

export default ContactButton;
