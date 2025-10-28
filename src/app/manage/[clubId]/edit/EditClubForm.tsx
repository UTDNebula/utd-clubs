'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { type SelectClub, type SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editClubSchema } from '@src/utils/formSchemas';

const EditClubForm = ({
  club,
}: {
  club: SelectClub & { contacts: SelectContact[] };
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof editClubSchema>>({
    resolver: zodResolver(editClubSchema),
    defaultValues: {
      id: club.id,
      name: club.name,
      description: club.description,
    },
  });
  const router = useRouter();
  const api = useTRPC();
  const editData = useMutation(
    api.club.edit.data.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );
  const submitForm = handleSubmit((data) => {
    if (!editData.isPending) {
      editData.mutate(data);
    }
  });
  return (
    <form onSubmit={submitForm}>
      <div className="flex h-full w-full flex-col gap-y-5">
        <div className="w-full rounded-md bg-slate-100 p-5 shadow-xs">
          <h1 className="text-xl font-extrabold text-black">
            Edit information
          </h1>
          <div className="flex flex-col gap-y-2 rounded-lg bg-slate-300 p-2">
            <div className="w-full rounded-md bg-slate-100 p-1 shadow-xs">
              <h2 className="text-lg font-extrabold">Organization name</h2>
              <input
                type="text"
                id="name"
                className="w-full bg-transparent"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="h-44 w-full rounded-md bg-slate-100 p-1 shadow-xs">
              <h2 className="text-lg font-extrabold">Description</h2>
              <textarea
                id="desc"
                className="h-24 w-full bg-transparent"
                {...register('description')}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
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
                  id: club.id,
                  name: club.name,
                  description: club.description,
                });
              }}
              disabled={!isDirty}
              className="group relative rounded-lg bg-slate-200 p-1 font-bold"
            >
              <div className="invisible absolute inset-0 h-full w-full rounded-lg bg-black opacity-80 group-disabled:visible"></div>
              <div>Discard Changes</div>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default EditClubForm;
