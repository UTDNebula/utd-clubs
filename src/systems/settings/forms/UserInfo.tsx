'use client';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonIconOutlined from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation } from '@tanstack/react-query';
import { add } from 'date-fns';
import { useState } from 'react';
import Panel from '@nebula-library/components/Panel';
import { majors, minors } from '@/common/utils/utdDegrees';
import { SelectUserMetadataWithClubs } from '@/server/db/models';
import { studentClassificationEnum } from '@/server/db/schema/users';
import { useTRPC } from '@/trpc/react';
import { useAppForm } from '@/common/utils/form';
import { AccountSettingsSchema, accountSettingsSchema } from '../schema';
import { setSnackbar, SnackbarPresets } from '@/common/modules/snackbar';

type UserInfoProps = {
  user: SelectUserMetadataWithClubs;
};

export default function UserInfo({ user }: UserInfoProps) {
  const api = useTRPC();

  const editAccountMutation = useMutation(
    api.user.metadata.updateById.mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedName('user info'));
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.saveFailedWithMessage(error.message));
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
        <div className="m-2 flex max-w-2xl flex-col gap-6">
          <form.FieldSet name="name" title="Name" icon={<PersonIconOutlined />}>
            <div className="flex flex-wrap gap-6">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField
                    label="First Name"
                    className="grow"
                    required
                    autoComplete="given-name"
                  />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField
                    label="Last Name"
                    className="grow"
                    autoComplete="family-name"
                  />
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
                      required
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
                      required
                    />
                  )}
                </form.AppField>
                <form.Subscribe
                  selector={(state) => state.values.studentClassification}
                >
                  {(studentClassification) => {
                    if (
                      studentClassification &&
                      ['Faculty', 'Staff'].includes(studentClassification)
                    )
                      return <div className="w-64 grow-1" />;
                    return (
                      <form.AppField name="graduationDate">
                        {(field) => {
                          return (
                            <DatePicker
                              onChange={(value) => {
                                const selectedValue = value as Date;

                                field.handleChange(selectedValue);
                                if (selectedValue < new Date()) {
                                  form.setFieldValue(
                                    'studentClassification',
                                    'Alum',
                                  );
                                } else if (
                                  selectedValue > new Date() &&
                                  form.getFieldValue(
                                    'studentClassification',
                                  ) === 'Alum'
                                ) {
                                  form.setFieldValue(
                                    'studentClassification',
                                    'Student',
                                  );
                                }
                              }}
                              value={field.state.value ?? null}
                              label="Graduation Date"
                              className="w-64 grow [&>.MuiPickersInputBase-root]:bg-white dark:[&>.MuiPickersInputBase-root]:bg-neutral-800"
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
                                  required: true,
                                },
                              }}
                              timezone="UTC"
                              views={['year', 'month']}
                              minDate={new Date(1973, 0, 1)} // Earliest UTD graduating class
                              maxDate={add(new Date(), { years: 9 })} // Divisible by the 3 years per row
                              yearsPerRow={3}
                              openTo="year"
                            />
                          );
                        }}
                      </form.AppField>
                    );
                  }}
                </form.Subscribe>
              </div>
            </div>
          </form.FieldSet>
          <form.FieldSet
            name="contact"
            title="Contact"
            icon={<EmailOutlinedIcon />}
          >
            <div className="flex w-full flex-wrap gap-6">
              <form.AppField name="contactEmail">
                {(field) => (
                  <div className="grow">
                    <field.TextField
                      label="UTD Email"
                      placeholder="abc123456@utdallas.edu"
                      className="w-full"
                      required
                      autoComplete="email"
                    />
                  </div>
                )}
              </form.AppField>
            </div>
          </form.FieldSet>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
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
