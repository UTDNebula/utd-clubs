/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type z } from 'zod';
import { UserSearchBar } from '@src/components/searchBar/UserSearchBar';
import { useTRPC } from '@src/trpc/react';
import { editOfficerSchema } from '@src/utils/formSchemas';

type x = {
  userId?: boolean;
  name?: boolean;
  locked?: boolean;
  title?: boolean;
  position?: boolean;
}[];
const modifiedFields = (
  dirtyFields: x,
  data: z.infer<typeof editOfficerSchema>,
  officers: {
    userId: string;
    name: string;
    locked: boolean;
    position: string;
  }[],
) => {
  const modded = data.officers.filter(
    (value, index) =>
      !!officers.find((off) => off.userId === value.userId) &&
      dirtyFields[index]?.title,
  );
  const created = data.officers.filter(
    (value, index) => dirtyFields[index]?.userId,
  );
  return {
    modified: modded,
    created: created,
  };
};

type modifyDeletedAction =
  | {
      type: 'add';
      target: z.infer<typeof editOfficerSchema>['officers'][number]['userId'];
    }
  | { type: 'reset' };
const deletedReducer = (
  state: Array<z.infer<typeof editOfficerSchema>['officers'][number]['userId']>,
  action: modifyDeletedAction,
) => {
  switch (action.type) {
    case 'add':
      return [...state, action.target];
    case 'reset':
      return [];
  }
};

type EditOfficerFormProps = {
  clubId: string;
  officers: {
    userId: string;
    name: string;
    locked: boolean;
    position: 'President' | 'Officer';
  }[];
};
const EditOfficerForm = ({ clubId, officers }: EditOfficerFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<z.infer<typeof editOfficerSchema>>({
    resolver: zodResolver(editOfficerSchema),
    defaultValues: { officers: officers },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'officers',
    keyName: 'fieldId',
  });
  const [deleted, modifyDeleted] = useReducer(deletedReducer, []);
  const removeItem = (index: number, userId: string) => {
    if (officers.find((officer) => officer.userId == userId))
      modifyDeleted({ type: 'add', target: userId });
    remove(index);
  };
  const router = useRouter();
  const api = useTRPC();
  const editOfficers = useMutation(
    api.club.edit.officers.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );
  const submitForm = handleSubmit((data) => {
    if (dirtyFields.officers !== undefined) {
      const { modified, created } = modifiedFields(
        dirtyFields.officers,
        data,
        officers,
      );
      if (!editOfficers.isPending) {
        editOfficers.mutate({
          clubId: clubId,
          deleted: deleted,
          modified: modified,
          created: created,
        });
      }
    }
  });
  return (
    <div className="h-full w-full">
      <form onSubmit={submitForm}>
        <div className="flex flex-col gap-y-2">
          <div>
            <UserSearchBar
              passUser={(user) => {
                append({
                  userId: user.id,
                  name: user.name,
                  title: 'Officer',
                  position: 'Officer',
                  locked: false,
                });
              }}
            />
          </div>
          <div>
            {errors.officers && (
              <p className="text-red-500">{errors.officers.message}</p>
            )}
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <OfficerItem
                key={field.fieldId}
                index={index}
                id={field.userId}
                remove={removeItem}
                locked={field.locked}
                name={field.name}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-x-4 py-2">
          <button
            className="rounded-lg bg-slate-200 p-1 font-bold"
            type="submit"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => {
              reset({
                officers: officers,
              });
              modifyDeleted({ type: 'reset' });
            }}
            disabled={!isDirty}
            className="group relative rounded-lg bg-slate-200 p-1 font-bold"
          >
            <div className="invisible absolute inset-0 h-full w-full rounded-lg bg-black opacity-80 group-disabled:visible"></div>
            <div>Discard Changes</div>
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditOfficerForm;
type OfficerItemProps = {
  remove: (index: number, userId: string) => void;
  id: string;
  index: number;
  name: string;
  locked: boolean;
};
const OfficerItem = ({ index, id, name, remove, locked }: OfficerItemProps) => {
  return (
    <div className="flex flex-row items-center rounded-md bg-slate-300 p-2">
      <div className="flex flex-col">
        <div>
          <h4 className="mb-1 bg-slate-300 text-xl font-bold text-black">
            {name}
          </h4>
        </div>
      </div>
      <button
        className="ml-auto disabled:hidden"
        type="button"
        onClick={() => remove(index, id)}
        disabled={locked}
      >
        remove
      </button>
    </div>
  );
};
