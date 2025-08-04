/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import { selectClub, type SelectClub } from '@src/server/db/models';
import { type Session } from 'next-auth';
import SettingsDropdown from './SettingsDropdown';
import SettingsInput from './SettingsInput';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ClubSelector from '@src/components/settings/ClubSelector';
import { useTRPC } from '@src/trpc/react';
import DeleteButton from './DeleteButton';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

type Props = {
  clubs: SelectClub[];
  user: Session['user'];
};

const settingsSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  major: z.string().min(1),
  minor: z.string().nullable(),
  year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad Student']),
  role: z.enum(['Student', 'Student Organizer', 'Administrator']),
  clubs: selectClub.pick({ name: true, id: true, profileImage: true }).array(),
});

export type SettingSchema = z.infer<typeof settingsSchema>;

export default function FormCard({ clubs, user }: Props) {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<SettingSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      clubs,
      firstName: user.firstName,
      lastName: user.lastName,
      major: user.major,
      minor: user.minor,
      role: user.role,
    },
  });
  const api = useTRPC();

  const { mutate } = useMutation(
    api.userMetadata.updateById.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );

  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate({
          clubs: data.clubs.map((club) => club.id),
          updateUser: {
            ...data,
          },
        });
      })}
    >
      <div className="grid w-fit grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <div className="grid grid-cols-2 space-x-2">
            <SettingsInput
              label="First Name"
              defaultValue={user.firstName}
              name="firstName"
              register={register}
            />
            <SettingsInput
              label="Last Name"
              defaultValue={user.lastName}
              name="lastName"
              register={register}
            />
          </div>
          <div className="grid grid-cols-2 space-x-2">
            <SettingsInput
              label="Major"
              defaultValue={user.major}
              name="major"
              register={register}
            />
            <SettingsInput
              label="Minor"
              defaultValue={user.minor || ''}
              name="minor"
              register={register}
            />
          </div>
          <div className="grid grid-cols-2 space-x-2">
            <SettingsDropdown
              label="Year"
              defaultValue={user.year}
              name="year"
              options={[
                'Freshman',
                'Sophomore',
                'Junior',
                'Senior',
                'Grad Student',
              ]}
              register={register}
            />
            <SettingsDropdown
              label="Role"
              defaultValue={user.role}
              name="role"
              options={['Student', 'Student Organizer', 'Administrator']}
              disabled
              register={register}
            />
          </div>
        </div>

        <div className="w-full">
          <h2 className="mb-2 font-medium text-slate-500">Clubs</h2>
          <div className="max-h-96 overflow-auto">
            <ClubSelector register={register} control={control} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <DeleteButton />
        <button
          type="submit"
          className="rounded-full bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
        >
          Apply Changes
        </button>
      </div>
    </form>
  );
}
