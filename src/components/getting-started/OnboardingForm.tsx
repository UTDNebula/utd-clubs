'use client';

import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { majors, minors } from '@src/constants/utdDegrees';
import { SelectUserMetadataWithClubs } from '@src/server/db/models';
import { studentClassificationEnum } from '@src/server/db/schema/users';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import {
  accountOnboardingSchema,
  AccountOnboardingSchema,
} from '@src/utils/formSchemas';

type OnboardingFormProps = {
  userMetadata?: SelectUserMetadataWithClubs;
  withLayout?: boolean;
};

export default function OnboardingForm({
  userMetadata,
  withLayout = false,
}: OnboardingFormProps) {
  const router = useRouter();
  const api = useTRPC();

  const editAccountMutation = useMutation(
    api.userMetadata.updateById.mutationOptions({}),
  );

  const [defaultValues, setDefaultValues] = useState<
    Partial<AccountOnboardingSchema>
  >({
    firstName: userMetadata?.firstName,
    lastName: userMetadata?.lastName,
    major: userMetadata?.major,
    minor: userMetadata?.minor,
    studentClassification: userMetadata?.studentClassification,
    graduationDate: userMetadata?.graduationDate
      ? new Date(
          userMetadata?.graduationDate?.getTime() +
            userMetadata?.graduationDate?.getTimezoneOffset() * 60 * 1000,
        )
      : undefined,
    contactEmail: userMetadata?.contactEmail ?? '',
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
    validators: { onChange: accountOnboardingSchema },
  });

  const FormElement = (
    <form.AppForm>
      <form.Wizard onComplete={() => router.push('/')}>
        <form.WizardStep startStep>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 ml-3.5">
              <Typography
                variant="h1"
                className="font-display text-4xl font-bold"
              >
                Get Started
              </Typography>
              <Typography variant="body1">
                Welcome to UTD Clubs! Let&apos;s get you set up.
              </Typography>
            </div>
          </div>
        </form.WizardStep>

        <form.WizardStep label="Name" fields={['firstName', 'lastName']}>
          <FormStepContent title="Name">
            <form.Question question="Please check that your name is correct. This is how you will appear to fellow students on UTD Clubs.">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField
                    label="First Name"
                    className="grow"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField label="Last Name" className="grow" />
                )}
              </form.AppField>
            </form.Question>
          </FormStepContent>
        </form.WizardStep>

        <form.WizardStep
          label="College Info"
          fields={['major', 'minor', 'studentClassification', 'graduationDate']}
        >
          <FormStepContent title="College Info">
            <form.Question
              question={
                'Enter your college major or "Undecided". If applicable, add your college minor.'
              }
            >
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
            </form.Question>
            <form.Question question="Are you a student? When do you graduate?">
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
                      value={field.state.value ?? null}
                      label="Graduation Date"
                      className="[&>.MuiPickersInputBase-root]:bg-white dark:[&>.MuiPickersInputBase-root]:bg-neutral-800 w-64 grow"
                      slotProps={{
                        actionBar: {
                          actions: ['accept'],
                        },
                        textField: {
                          size: 'small',
                          error: !field.state.meta.isValid,
                          helperText: !field.state.meta.isValid
                            ? (
                                field.state.meta.errors as unknown as {
                                  message: string;
                                }[]
                              )
                                .map((err) => err?.message)
                                .join('. ') + '.'
                            : undefined,
                          required: true,
                        },
                      }}
                      timezone="UTC"
                      views={['year', 'month']}
                      openTo="year"
                    />
                  );
                }}
              </form.AppField>
            </form.Question>
          </FormStepContent>
        </form.WizardStep>

        <form.WizardStep label="Contact Email" fields={['contactEmail']}>
          <FormStepContent title="Contact Email">
            <form.Question question="Please enter your UTD email so club and event organizers can contact you.">
              <form.AppField name="contactEmail">
                {(field) => (
                  <div className="grow">
                    <field.TextField
                      label="UTD Email"
                      placeholder="abc123456@utdallas.edu"
                      className="w-full"
                      required
                    />
                  </div>
                )}
              </form.AppField>
            </form.Question>
          </FormStepContent>
        </form.WizardStep>

        <form.WizardStep finishStep>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 ml-3.5">
              <Typography
                variant="h1"
                className="font-display text-4xl font-bold"
              >
                Thank you!
              </Typography>
              <Typography variant="body1">
                You are now ready to use UTD Clubs. You can always change
                everything later in your{' '}
                <Link
                  href={'/settings'}
                  className="text-royal dark:text-cornflower-300 underline"
                >
                  account settings
                </Link>
                .
              </Typography>
            </div>
          </div>
        </form.WizardStep>
      </form.Wizard>
    </form.AppForm>
  );

  return withLayout ? (
    <div className="flex w-full flex-col items-center p-4">
      <div className="w-full max-w-6xl">{FormElement}</div>
    </div>
  ) : (
    <>{FormElement}</>
  );
}

function FormStepContent({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h2" className="font-display text-2xl font-bold">
        {title}
      </Typography>
      <div className="flex flex-col gap-12">{children}</div>
    </div>
  );
}
