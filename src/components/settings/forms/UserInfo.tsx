'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SelectOption } from '@src/components/form/FormSelect';
import Panel from '@src/components/form/Panel';
import { SelectUserMetadata, type SelectClub } from '@src/server/db/models';
import { roleEnum } from '@src/server/db/schema/users';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import {
  AccountSettingsSchema,
  accountSettingsSchema,
} from '@src/utils/formSchemas';

type UserInfoProps = {
  clubs: SelectClub[];
  user: SelectUserMetadata;
};

type UserRoleEnum = (typeof roleEnum.enumValues)[number];

const UserRoleOptions: SelectOption<UserRoleEnum>[] = [
  { value: 'Student' },
  { value: 'Student Organizer' },
  { value: 'Administrator' },
];

export default function UserInfo({ clubs, user }: UserInfoProps) {
  const router = useRouter();
  const api = useTRPC();

  const editAccountMutation = useMutation(
    api.userMetadata.updateById.mutationOptions({
      // onSuccess: () => {
      //   router.refresh();
      // },
    }),
  );

  const defaultValues: AccountSettingsSchema = {
    clubs,
    firstName: user.firstName,
    lastName: user.lastName,
    major: user.major,
    minor: user.minor,
    role: user.role,
    year: user.year,
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      console.log('submit please');
    },
    validators: { onChange: accountSettingsSchema },
  });

  // const { register, handleSubmit, control } = useForm<AccountSettingsSchema>({
  //   resolver: zodResolver(accountSettingsSchema),
  //   defaultValues: {
  //     clubs,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     major: user.major,
  //     minor: user.minor,
  //     role: user.role,
  //   },
  // });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Panel heading="Personal Information">
        <div className="m-2 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <form.AppField name="firstName">
              {(field) => <field.TextField label="First Name" />}
            </form.AppField>
            <form.AppField name="lastName">
              {(field) => <field.TextField label="Last Name" />}
            </form.AppField>
          </div>
          <div className="flex flex-wrap gap-4">
            <form.AppField name="major">
              {(field) => <field.TextField label="Major" />}
            </form.AppField>
            <form.AppField name="minor">
              {(field) => <field.TextField label="Minor" />}
            </form.AppField>
          </div>
          <div className="flex flex-wrap gap-4">
            <form.AppField name="year">
              {(field) => <field.TextField label="Class of" />}
            </form.AppField>
            <form.AppField name="role">
              {(field) => (
                <field.Select label="Role" options={UserRoleOptions} disabled />
              )}
            </form.AppField>
          </div>
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.ResetButton />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton />
          </form.AppForm>
        </div>
        {/* <div className="grid w-fit grid-cols-1 gap-3 lg:grid-cols-2">
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
        </div> */}
      </Panel>
    </form>
  );
}
