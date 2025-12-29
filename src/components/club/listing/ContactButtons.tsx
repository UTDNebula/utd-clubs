import { IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';
import { logo } from '@src/icons/ContactIcons';
import type { SelectContact } from '@src/server/db/models';
import { contactNames } from '@src/server/db/schema/contacts';

type ContactButtonProps = {
  contacts: SelectContact[];
};
const ContactButtons = ({ contacts }: ContactButtonProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {contacts.map((item) => (
        <Tooltip
          key={item.platform + item.url}
          title={contactNames[item.platform]}
        >
          <Link
            href={item.platform === 'email' ? `mailto:${item.url}` : item.url}
            target="_blank"
            className="inline-block"
          >
            <IconButton className="group bg-white dark:bg-haiti" size="large">
              {logo[item.platform]}
            </IconButton>
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};

export default ContactButtons;
