import { IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';
import { logo } from '@src/icons/ContactIcons';
import type { SelectContact } from '@src/server/db/models';
import { contactNames } from '@src/server/db/schema/contacts';

type ContactButtonProps = {
  contact: SelectContact;
};
const ContactButton = ({ contact }: ContactButtonProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        key={contact.platform + contact.url}
        title={contactNames[contact.platform]}
      >
        <Link
          href={contact.platform === 'email' ? `mailto:${contact.url}` : contact.url}
          target="_blank"
          className="inline-block"
        >
          <IconButton className="group bg-slate-100" size="large">
            {logo[contact.platform]}
          </IconButton>
        </Link>
      </Tooltip>
    </div>
  );
};

export default ContactButton;
