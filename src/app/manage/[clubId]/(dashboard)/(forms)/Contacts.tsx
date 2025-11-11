'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import EditContactSelector from '@src/app/manage/[clubId]/edit/EditContactSelector';
import Form from '@src/components/club/manage/components/Form';
import {
  FormButtons,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import PillButton from '@src/components/PillButton';
import { PlusIcon } from '@src/icons/Icons';
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
          Placeholder
        </div>
        <PillButton type="button" IconComponent={PlusIcon}>
          Add Contact
        </PillButton>
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Contacts;
