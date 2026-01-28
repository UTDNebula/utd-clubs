'use client';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonIconOutlined from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import { majors, minors } from '@src/constants/utdDegrees';
import { SelectUserMetadataWithClubs } from '@src/server/db/models';
import { studentClassificationEnum } from '@src/server/db/schema/users';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import {
  AccountSettingsSchema,
  accountSettingsSchema,
} from '@src/utils/formSchemas';
import { setSnackbar, SnackbarPresets } from '@src/utils/Snackbar';

type UserInfoProps = {
  user: SelectUserMetadataWithClubs;
};

export default function UserInfo({ user }: UserInfoProps) {
  const api = useTRPC();

  const editAccountMutation = useMutation(
    api.userMetadata.updateById.mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedName('user info'));
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.errorMessage(error.message));
      },
    }),
  );

  const [defaultValues, setDefaultValues] = useState<AccountSettingsSchema>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    major: user?.major ?? '',
    minor: user?.minor ?? '',
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
        <div className="m-2 flex flex-col gap-6 max-w-2xl">
          <form.FieldSet name="name" title="Name" icon={<PersonIconOutlined />}>
            <div className="flex flex-wrap gap-6">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField label="First Name" className="grow" />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField label="Last Name" className="grow" />
                )}
              </form.AppField>
            </div>
          </form.FieldSet>
          <form.FieldSet
            name="college"
            title="College"
            icon={<SchoolOutlinedIcon />}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-6">
                <form.AppField name="major">
                  {(field) => (
                    <field.AutocompleteFreeSolo
                      label="Major"
                      options={majors}
                      className="grow"
                    />
                  )}
                </form.AppField>
                <form.AppField name="minor">
                  {(field) => (
                    <field.AutocompleteFreeSolo
                      label="Minor"
                      options={minors}
                      className="grow"
                    />
                  )}
                </form.AppField>
              </div>
              <div className="flex flex-wrap gap-6">
                <form.AppField name="studentClassification">
                  {(field) => (
                    <field.Select
                      label="Classification"
                      options={studentClassificationEnum.enumValues}
                      className="grow"
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
                        className="[&>.MuiPickersInputBase-root]:bg-white dark:[&>.MuiPickersInputBase-root]:bg-neutral-900 w-64 grow"
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
            </div>
          </form.FieldSet>
          <form.FieldSet
            name="contact"
            title="Contact"
            icon={<EmailOutlinedIcon />}
          >
            <div className="flex flex-wrap gap-6 w-full">
              <form.AppField name="contactEmail">
                {(field) => (
                  <div className="grow">
                    <field.TextField
                      label="UTD Email"
                      placeholder="abc123456@utdallas.edu"
                      className="w-full"
                    />
                  </div>
                )}
              </form.AppField>
            </div>
          </form.FieldSet>
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
