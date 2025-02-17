/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@src/trpc/react';
import { editListedOfficerSchema } from '@src/utils/formSchemas';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import {
  type FieldErrors,
  type UseFormRegister,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { type z } from 'zod';

type x = {
  id?: boolean;
  name?: boolean;
  position?: boolean;
}[];
const modifiedFields = (
  dirtyFields: x,
  data: z.infer<typeof editListedOfficerSchema>,
  officers: {
    id?: string;
    name: string;
    position: string;
  }[],
) => {
  const modded = data.officers.filter(
    (value, index) =>
      !!officers.find((off) => off.id === value.id) &&
      dirtyFields[index]?.position,
  );
  const created = data.officers.filter(
    (value) => typeof value.id === 'undefined',
  );
  return {
    modified: modded as { id: string; name: string; position: string }[],
    created: created as { name: string; position: string }[],
  };
};

type modifyDeletedAction =
  | {
      type: 'add';
      target: string;
    }
  | { type: 'reset' };
const deletedReducer = (state: Array<string>, action: modifyDeletedAction) => {
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
    id: string;
    name: string;
    position: string;
  }[];
};
const EditOfficerForm = ({ clubId, officers }: EditOfficerFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<z.infer<typeof editListedOfficerSchema>>({
    resolver: zodResolver(editListedOfficerSchema),
    defaultValues: { officers: officers },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'officers',
  });
  const [deleted, modifyDeleted] = useReducer(deletedReducer, []);
  const removeItem = (index: number) => {
    const off = officers.find((officer) => officer.id == fields[index]?.id);
    if (off) modifyDeleted({ type: 'add', target: off.id });
    remove(index);
  };
  const router = useRouter();
  const editOfficers = api.club.edit.listedOfficers.useMutation({
    onSuccess: () => {
      router.push(`/directory/${clubId}`);
    },
  });
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
          <div className="mb-2 flex flex-row">
            <button
              className="ml-auto rounded-lg bg-slate-200 p-2"
              type="button"
              onClick={() => {
                append({ name: '', position: '' });
              }}
            >
              add new Officer
            </button>
          </div>
          <div>
            {errors.officers && (
              <p className="text-red-500">{errors.officers.message}</p>
            )}
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <OfficerItem
                key={field.id}
                register={register}
                index={index}
                remove={removeItem}
                errors={errors}
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
  register: UseFormRegister<z.infer<typeof editListedOfficerSchema>>;
  remove: (index: number) => void;
  index: number;
  errors: FieldErrors<z.infer<typeof editListedOfficerSchema>>;
};
const OfficerItem = ({ register, index, remove, errors }: OfficerItemProps) => {
  return (
    <div className="flex flex-row items-center rounded-md bg-slate-300 p-2">
      <div className="flex flex-col">
        <div>
          <input
            type="text"
            placeholder="Name"
            className="mb-1 bg-slate-300 text-xl font-bold text-black"
            {...register(`officers.${index}.name` as const)}
            aria-invalid={errors.officers && !!errors.officers[index]?.position}
          />
          {errors.officers && errors.officers[index]?.position && (
            <p className="text-red-500">
              {errors.officers[index]?.position?.message}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Position"
            className="bg-slate-300 font-semibold text-black"
            {...register(`officers.${index}.position` as const)}
            aria-invalid={errors.officers && !!errors.officers[index]?.position}
          />
          {errors.officers && errors.officers[index]?.position && (
            <p className="text-red-500">
              {errors.officers[index]?.position?.message}
            </p>
          )}
        </div>
      </div>
      <button
        className="ml-auto disabled:hidden"
        type="button"
        onClick={() => remove(index)}
      >
        remove
      </button>
    </div>
  );
};
