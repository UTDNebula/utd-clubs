/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import EditContactSelector from '@src/app/manage/[clubId]/edit/EditContactSelector';
import { type SelectClub, type SelectContact } from '@src/server/db/models';
import { api } from '@src/trpc/react';
import { type contact } from '@src/utils/contact';
import { editClubContactSchema } from '@src/utils/formSchemas';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

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
export default function EditContactForm({
  club,
}: {
  club: SelectClub & { contacts: contact[] };
}) {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<z.infer<typeof editClubContactSchema>>({
    resolver: zodResolver(editClubContactSchema),
    defaultValues: {
      contacts: club.contacts,
    },
  });
  const router = useRouter();
  const editContacts = api.club.edit.contacts.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const [deleted, modifyDeleted] = useReducer(deletedReducer, []);
  const submitForm = handleSubmit((data) => {
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
    <div className="container w-full rounded-md bg-slate-100 p-4 shadow-sm">
      <form onSubmit={submitForm}>
        <EditContactSelector
          control={control}
          register={register}
          errors={errors}
          modifyDeleted={modifyDeleted}
        />
        <div className="flex flex-row justify-end gap-x-4 py-2">
          <button className="rounded-lg bg-slate-200 p-1 font-bold">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => {
              reset({ contacts: club.contacts });
              modifyDeleted({ type: 'reset' });
            }}
            disabled={!isDirty}
            className="group relative rounded-lg bg-slate-200 p-1 font-bold"
          >
            <div className="invisible absolute inset-0 h-full w-full rounded-lg bg-black opacity-80 group-disabled:visible"></div>
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
}
