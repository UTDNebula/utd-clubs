'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { SelectOption } from '@src/components/form/FormSelect';
import Panel from '@src/components/form/Panel';
import { SelectUserMetadataWithClubs } from '@src/server/db/models';
import { roleEnum } from '@src/server/db/schema/users';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import {
  AccountSettingsSchema,
  accountSettingsSchema,
} from '@src/utils/formSchemas';

type UserInfoProps = {
  user: SelectUserMetadataWithClubs;
};

type UserRoleEnum = (typeof roleEnum.enumValues)[number];

const UserRoleOptions: SelectOption<UserRoleEnum>[] = [
  {
    value: 'Student',
    label: 'Student',
  },
  {
    value: 'Student Organizer',
    label: 'Organizer',
  },
  {
    value: 'Administrator',
    label: 'Admin',
  },
];

export default function UserInfo({ user }: UserInfoProps) {
  const api = useTRPC();

  const editAccountMutation = useMutation(
    api.userMetadata.updateById.mutationOptions({}),
  );

  const [defaultValues, setDefaultValues] = useState<AccountSettingsSchema>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    major: user?.major ?? '',
    minor: user?.minor ?? '',
    role: user?.role ?? 'Student',
    year: user?.year ?? 'Freshman',
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      try {
        const updated = await editAccountMutation.mutateAsync({
          updateUser: value,
        });
        if (updated) {
          setDefaultValues(updated);
          formApi.reset(updated);
        }
      } catch (e) {
        console.error(e);
      }
    },
    validators: { onChange: accountSettingsSchema },
  });

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
              {(field) => (
                <field.Autocomplete
                  freeSolo
                  label="Class of"
                  options={[
                    'Freshman',
                    'Sophomore',
                    'Junior',
                    'Senior',
                    'Grad Student',
                  ]}
                />
              )}
            </form.AppField>
            <form.AppField name="role">
              {(field) => (
                <field.Autocomplete label="Role" options={UserRoleOptions} />
              )}
            </form.AppField>
            {/* <form.AppField name="role">
              {(field) => (
                <field.Select label="Role" options={UserRoleOptions} disabled />
              )}
            </form.AppField> */}
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
