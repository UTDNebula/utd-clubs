import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useReducer, useRef, useState } from 'react';
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import { type z } from 'zod';
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
import { contactNames, startContacts } from '@src/server/db/schema/contacts';
import { type createClubSchema } from '@src/utils/formSchemas';

type Contact = Omit<SelectContact, 'clubId'>;

function Reducer(
  state: Array<Contact['platform']>,
  action: {
    type: 'add' | 'remove';
    target: Contact['platform'];
  },
) {
  switch (action.type) {
    case 'remove':
      return state.filter((x) => x != action.target);
    case 'add':
      return [...state, action.target];
  }
}

type ContactSelectorProps = {
  control: Control<z.infer<typeof createClubSchema>>;
  register: UseFormRegister<z.infer<typeof createClubSchema>>;
  errors: FieldErrors<z.infer<typeof createClubSchema>>;
};
const ContactSelector = ({
  control,
  register,
  errors,
}: ContactSelectorProps) => {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'contacts',
  });
  const [available, dispatch] = useReducer(Reducer, startContacts);
  const takeFromAvailable = (platform: Contact['platform']) => {
    dispatch({ type: 'remove', target: platform });
    append({ platform: platform, url: '' });
  };
  const returnToAvailable = (index: number, platform: Contact['platform']) => {
    remove(index);
    dispatch({ type: 'add', target: platform });
  };

  const addNewButtonRef = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2>Contacts</h2>
        <Button
          variant="contained"
          className="normal-case"
          onClick={() => setOpen(true)}
          ref={addNewButtonRef}
        >
          Add New Contact
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <ContactInput
            key={field.id}
            index={index}
            register={register}
            platform={field.platform}
            remove={returnToAvailable}
            errors={errors}
          />
        ))}
      </div>
      <Menu
        anchorEl={addNewButtonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        {available.map((plat) => (
          <MenuItem
            key={plat}
            onClick={() => {
              setOpen(false);
              takeFromAvailable(plat);
            }}
          >
            <ListItemIcon>{logo[plat]}</ListItemIcon>
            <ListItemText>{contactNames[plat]}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default ContactSelector;
const styling = 'fill-black transition-colors group-hover:fill-royal';
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

type ContactInputProps = {
  register: UseFormRegister<z.infer<typeof createClubSchema>>;
  remove: (index: number, platform: Contact['platform']) => void;
  platform: Contact['platform'];
  index: number;
  errors: FieldErrors<z.infer<typeof createClubSchema>>;
};
const ContactInput = ({
  register,
  remove,
  platform,
  index,
  errors,
}: ContactInputProps) => {
  return (
    <div className="flex flex-row items-center bg-slate-200 p-2">
      <div className="flex w-fit flex-row items-center rounded-md bg-slate-300 p-2">
        <div className="box-content h-8 w-8">
          <div className="h-8 w-8">{logo[platform]}</div>
        </div>
        <div className="text-xl">{contactNames[platform]}</div>
      </div>
      <div>
        <div>Link here</div>
        <input
          className="bg-white"
          type="text"
          {...register(`contacts.${index}.url` as const)}
          aria-invalid={errors.contacts && !!errors.contacts[index]?.url}
        />
        {errors.contacts && errors.contacts[index]?.url && (
          <p className="text-red-500">{errors.contacts[index]?.url?.message}</p>
        )}
      </div>
      <button
        className="ml-auto"
        onClick={() => {
          remove(index, platform);
        }}
      >
        Remove
      </button>
    </div>
  );
};
