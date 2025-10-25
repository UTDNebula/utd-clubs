import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { useReducer } from 'react';
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
import { type SelectContact } from '@src/server/db/models';
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
const startContacts: Array<Contact['platform']> = [
  'discord',
  'instagram',
  'website',
  'email',
  'twitter',
  'facebook',
];

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
  return (
    <div>
      <div className="flex flex-row py-1">
        <h2>Contacts</h2>
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
                    onSelect={() => {
                      takeFromAvailable(plat);
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
        <div className="text-xl">{platform}</div>
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
