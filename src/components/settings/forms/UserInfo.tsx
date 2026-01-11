'use client';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { SelectOption } from '@src/components/form/FormSelect';
import Panel from '@src/components/form/Panel';
import { SelectUserMetadataWithClubs } from '@src/server/db/models';
import {
  roleEnum,
  studentClassificationEnum,
} from '@src/server/db/schema/users';
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
    studentClassification: user?.studentClassification ?? 'Student',
    // `user.graduation` is automatically set with a time zone, which shows the wrong month in the date picker
    // Add the timezone offset (in milliseconds) to convert back to UTC
    graduationDate: user?.graduationDate
      ? new Date(
          user?.graduationDate?.getTime() +
            user?.graduationDate?.getTimezoneOffset() * 60 * 1000,
        )
      : null,
    contactEmail: user?.contactEmail ?? '',
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      try {
        const updated = await editAccountMutation.mutateAsync({
          updateUser: value,
        });
        if (updated) {
          const updatedFixed = {
            ...updated,
            graduationDate: updated?.graduationDate
              ? new Date(
                  updated?.graduationDate?.getTime() +
                    updated?.graduationDate?.getTimezoneOffset() * 60 * 1000,
                )
              : null,
          };

          setDefaultValues(updatedFixed);
          formApi.reset(updatedFixed);
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
            <form.AppField name="studentClassification">
              {(field) => (
                <field.Select
                  label="Classification"
                  options={studentClassificationEnum.enumValues}
                />
              )}
            </form.AppField>
            <form.AppField name="graduationDate">
              {(field) => {
                return (
                  <DatePicker
                    onChange={(value) => {
                      field.handleChange(value);
                    }}
                    value={field.state.value}
                    label="Graduation Date"
                    className="grow [&>.MuiPickersInputBase-root]:bg-white"
                    slotProps={{
                      actionBar: {
                        actions: ['accept'],
                      },
                      textField: {
                        size: 'small',
                        error: !field.state.meta.isValid,
                        helperText: !field.state.meta.isValid
                          ? field.state.meta.errors
                              .map((err) => err?.message)
                              .join('. ') + '.'
                          : undefined,
                      },
                    }}
                    timezone="UTC"
                    views={['year', 'month']}
                    openTo="year"
                  />
                );
              }}
            </form.AppField>
          </div>
          <div className="flex flex-wrap gap-4">
            <form.AppField name="contactEmail">
              {(field) => (
                <field.TextField
                  label="UTD Email"
                  placeholder="abc123456@utdallas.edu"
                />
              )}
            </form.AppField>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* <form.AppField name="role">
              {(field) => (
                <field.Autocomplete label="Role" options={UserRoleOptions} />
              )}
            </form.AppField> */}
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
      </Panel>
    </form>
  );
}
