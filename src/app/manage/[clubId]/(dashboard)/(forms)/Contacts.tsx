'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type z } from 'zod';
import Form from '@src/components/club/manage/components/Form';
import ContactListItem from '@src/components/club/manage/ContactListItem';
import {
  FormButtons,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { type contact } from '@src/utils/contact';
import { editClubContactSchema } from '@src/utils/formSchemas';

type formData = z.infer<typeof editClubContactSchema>;

type x = {
  platform?: boolean | undefined;
  url?: boolean | undefined;
  clubId?: boolean | undefined;
}[];

const modifiedFields = (dirtyFields: x, data: formData) => {
  const modded = data.contacts.filter(
    (value, index) =>
      Object.values(dirtyFields[index] ?? {}).reduce(
        (previous, current) => previous || current,
      ) && value.clubId,
  );
  const created = data.contacts.filter(
    (value, index) =>
      Object.values(dirtyFields[index] ?? {}).reduce(
        (previous, current) => previous || current,
      ) && !value.clubId,
  );
  return {
    modified: modded as SelectContact[],
    created: created as Omit<SelectContact, 'clubId'>[],
  };
};

export type modifyDeletedAction =
  | {
      type: 'add';
      target: formData['contacts'][number]['platform'];
    }
  | { type: 'reset' };

const deletedReducer = (
  state: Array<formData['contacts'][number]['platform']>,
  action: modifyDeletedAction,
) => {
  switch (action.type) {
    case 'add':
      return [...state, action.target];
    case 'reset':
      return [];
  }
};

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

// ---

type ContactsProps = {
  club: SelectClub & { contacts: SelectContact[] };
};

const Contacts = ({ club }: ContactsProps) => {
  const methods = useForm<z.infer<typeof editClubContactSchema>>({
    resolver: zodResolver(editClubContactSchema),
    defaultValues: {
      contacts: club.contacts,
    },
    mode: 'onTouched',
  });

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = methods;

  const [deleted, modifyDeleted] = useReducer(deletedReducer, []);

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'contacts',
    keyName: 'fieldId',
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

  const addNewButtonRef = useRef(null);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const api = useTRPC();
  const editContacts = useMutation(
    api.club.edit.contacts.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );

  const submitForm = handleSubmit((data) => {
    window.alert('Saved form!');
    console.log(JSON.stringify(data));

    if (dirtyFields.contacts !== undefined) {
      const { modified, created } = modifiedFields(dirtyFields.contacts, data);
      if (!editContacts.isPending) {
        editContacts.mutate({
          clubId: club.id,
          deleted: deleted,
          modified: modified,
          created: created,
        });
      }
    }
  });

  return (
    <Form
      methods={methods}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={submitForm}
    >
      <FormFieldSet legend="Edit Contacts">
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <ContactListItem
              key={field.fieldId}
              register={register}
              index={index}
              remove={removeItem}
              errors={errors}
              platform={field.platform}
            />
          ))}
        </div>
        <Button
          className="normal-case mb-2"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => {
            append({ platform: 'website', url: '' });
          }}
        >
          Add Contact
        </Button>
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Contacts;

// TODO: Remove button does not work
// TODO: Make Platform input a dropdown selector list
// NOTE: There can only be one of each platform, make sure the dropdown list reflects that
