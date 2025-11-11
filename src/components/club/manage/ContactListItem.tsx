/* eslint-disable @typescript-eslint/no-unused-vars */
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
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
import { FormInput } from './FormComponents';

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
};

const ContactListItem = ({
  register,
  remove,
  platform,
  index,
  errors,
}: ContactListItemProps) => {
  return (
    <div className="flex flex-row items-center p-2 hover:bg-slate-100 transition-colors rounded-lg">
      <div className="flex flex-row w-full flex-wrap">
        {/* <div className="flex w-fit flex-row items-center rounded-md bg-slate-300 p-2">
        <div className="box-content h-8 w-8">
          <div className="h-8 w-8">{logo[platform]}</div>
        </div>
        <div className="text-xl">{platform}</div>
      </div> */}

        <FormInput
          type="text"
          label="Platform"
          name={`contacts.${index}.platform`}
          register={register}
          error={errors.contacts && errors?.contacts[index]?.platform}
          aria-invalid={errors.contacts && !!errors.contacts[index]?.platform}
        ></FormInput>

        <FormInput
          type="text"
          label="URL"
          name={`contacts.${index}.url`}
          register={register}
          error={errors.contacts && errors?.contacts[index]?.url}
          aria-invalid={errors.contacts && !!errors.contacts[index]?.url}
          className="grow-1"
        ></FormInput>

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
  );
};

export default ContactListItem;
