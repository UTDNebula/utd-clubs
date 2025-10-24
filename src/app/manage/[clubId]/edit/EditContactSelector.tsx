import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { type SelectContact } from '@src/server/db/models';
import { type Dispatch, useEffect, useReducer } from 'react';
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
  Twitter,
  Website,
  Youtube,
  type logoProps,
} from '@src/icons/ContactIcons';
import { type modifyDeletedAction } from '@src/app/manage/[clubId]/edit/EditContactForm';
import { type editClubContactSchema } from '@src/utils/formSchemas';

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
];

type ContactSelectorProps = {
  control: Control<z.infer<typeof editClubContactSchema>>;
  register: UseFormRegister<z.infer<typeof editClubContactSchema>>;
  errors: FieldErrors<z.infer<typeof editClubContactSchema>>;
  modifyDeleted: Dispatch<modifyDeletedAction>;
};
const ContactSelector = ({
  control,
  register,
  errors,
  modifyDeleted,
}: ContactSelectorProps) => {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'contacts',
  });
  const [available, dispatch] = useReducer(Reducer, startContacts);
  const addNew = (platform: Contact['platform']) => {
    dispatch({ type: 'remove', target: platform });
    append({ platform: platform, url: '' });
  };
  const removeItem = (index: number, platform: Contact['platform']) => {
    const field = fields[index];
    if (field?.clubId) {
      modifyDeleted({ type: 'add', target: field.platform });
    }
    remove(index);
    dispatch({ type: 'add', target: platform });
  };
  useEffect(() => {
    dispatch({
      type: 'reset',
      base: startContacts,
      used: fields.map((x) => x.platform),
    });
  }, [fields]);
  return (
    <div>
      <div className="mb-2 flex flex-row items-center">
        <h2 className="text-xl font-bold">Edit Contacts</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="ml-auto rounded-lg bg-slate-200 p-2"
              type="button"
            >
              add new contact
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <div className="mb-2 flex h-fit w-40 flex-wrap rounded-lg bg-slate-200 p-2 drop-shadow-md">
                {available.map((plat) => (
                  <DropdownMenuItem
                    key={plat}
                    onSelect={(_e) => {
                      addNew(plat);
                    }}
                  >
                    <div className="group h-8 w-8" title={plat}>
                      {logo[plat]}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
      <div className="space-y-2 rounded-lg bg-slate-200 p-2">
        {fields.map((field, index) => (
          <ContactInput
            key={field.id}
            index={index}
            register={register}
            platform={field.platform}
            remove={removeItem}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
};
export default ContactSelector;
const styling = 'fill-black transition-colors group-hover:fill-blue-primary';
const logo: logoProps = {
  discord: <Discord className={styling} />,
  youtube: <Youtube className={styling} />,
  twitch: '/nebula-logo.png',
  facebook: <Facebook className={styling} />,
  twitter: <Twitter className={styling} />,
  instagram: <Instagram className={styling} />,
  website: <Website className={styling} />,
  email: <Email className={styling} />,
  other: '/Jupiter.png',
};

type ContactInputProps = {
  register: UseFormRegister<z.infer<typeof editClubContactSchema>>;
  remove: (index: number, platform: Contact['platform']) => void;
  platform: Contact['platform'];
  index: number;
  errors: FieldErrors<z.infer<typeof editClubContactSchema>>;
};
const ContactInput = ({
  register,
  remove,
  platform,
  index,
  errors,
}: ContactInputProps) => {
  return (
    <div className="flex flex-row items-center rounded-md bg-slate-300 p-1 align-middle">
      <div className="flex w-fit flex-row items-center rounded-md bg-slate-300 p-2">
        <div className="box-content h-8 w-8">
          <div className="h-8 w-8">{logo[platform]}</div>
        </div>
        <div className="text-xl">{platform}</div>
      </div>
      <div className="w-full">
        <input
          type="text"
          {...register(`contacts.${index}.url` as const)}
          aria-invalid={errors.contacts && !!errors.contacts[index]?.url}
          className="w-full bg-transparent"
        />
        {errors.contacts && errors.contacts[index]?.url && (
          <p className="text-red-500">{errors.contacts[index]?.url?.message}</p>
        )}
      </div>
      <button
        className="ml-auto pl-2"
        onClick={() => {
          remove(index, platform);
        }}
      >
        Remove
      </button>
    </div>
  );
};
