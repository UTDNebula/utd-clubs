/* eslint-disable @typescript-eslint/no-unused-vars */
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, MenuItem } from '@mui/material';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type z from 'zod';
import {
  Discord,
  Email,
  Facebook,
  Instagram,
  Link,
  LinkedIn,
  Twitch,
  Twitter,
  Website,
  Youtube,
  type logoProps,
} from '@src/icons/ContactIcons';
import { type SelectContact } from '@src/server/db/models';
import { type editClubContactSchema } from '@src/utils/formSchemas';
import { FormSelect } from './form/FormSelect';
import FormTextField from './form/FormTextField';

type Contact = Omit<SelectContact, 'clubId'>;

function Reducer(
  state: Array<Contact['platform']>,
  action:
    | {
        type: 'add' | 'remove';
        target: Contact['platform'];
      }
    | {
        type: 'reset';
        used: Contact['platform'][];
        base: Contact['platform'][];
      },
) {
  switch (action.type) {
    case 'remove':
      return state.filter((x) => x != action.target);
    case 'add':
      return [...state, action.target];
    case 'reset':
      return action.base.filter((x) => !action.used.includes(x));
  }
}
const startContacts: Array<Contact['platform']> = [
  'discord',
  'instagram',
  'website',
  'email',
  'twitter',
  'facebook',
  'youtube',
  'twitch',
  'linkedIn',
  'other',
];

const contactNames: { [key in Contact['platform']]: string } = {
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

const styling = 'fill-black transition-colors group-hover:fill-blue-primary';
const logo: logoProps = {
  discord: <Discord className={styling} />,
  instagram: <Instagram className={styling} />,
  website: <Website className={styling} />,
  email: <Email className={styling} />,
  twitter: <Twitter className={styling} />,
  facebook: <Facebook className={styling} />,
  youtube: <Youtube className={styling} />,
  twitch: <Twitch className={styling} />,
  linkedIn: <LinkedIn className={styling} />,
  other: <Link className={styling} />,
};

type ContactListItemProps = {
  register: UseFormRegister<z.infer<typeof editClubContactSchema>>;
  remove: (index: number, platform: Contact['platform']) => void;
  platform: Contact['platform'];
  index: number;
  errors: FieldErrors<z.infer<typeof editClubContactSchema>>;
  available?: typeof startContacts;
};

const ContactListItem = ({
  register,
  remove,
  platform,
  index,
  errors,
  available,
}: ContactListItemProps) => {
  return (
    <div className="flex flex-row p-2 hover:bg-slate-100 transition-colors rounded-lg">
      <div className="flex flex-row w-full flex-wrap">
        <FormSelect name={`contacts.${index}.platform`} label="Platform">
          {available &&
            available.map((platform, index) => (
              <MenuItem key={index} value={platform}>
                {contactNames[platform]}
                {/* foo */}
                {/* <div className="box-content h-8 w-8">
                  <div className="h-8 w-8">{logo[platform]}</div>
                </div>
                <div className="text-xl">{contactNames[platform]}</div> */}
              </MenuItem>
            ))}
        </FormSelect>
        <FormTextField
          name={`contacts.${index}.url`}
          label="URL"
          className="grow-1"
        />

        <div className="h-10 mt-2">
          <IconButton
            aria-label="remove"
            title="Remove"
            className="self-center"
            onClick={() => remove(index, platform)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ContactListItem;
