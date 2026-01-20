import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Link from 'next/link';
import { ReactNode } from 'react';
import { majors, minors } from '@src/constants/utdDegrees';
import { studentClassificationEnum } from '@src/server/db/schema/users';
import { withForm } from '@src/utils/form';
import { AccountOnboardingSchema } from '@src/utils/formSchemas';

export type StepObject = {
  id: string | number;
  label: string;
  description?: string;
  hidden?: boolean;
};

type FormData = Partial<AccountOnboardingSchema>;

const FormStep = withForm({
  defaultValues: {} as FormData,
  props: {
    step: {} as StepObject | undefined,
    active: false as boolean | undefined,
  },
  render: function Render({ form, step, active }) {
    let FormStepData: ReactNode;

    switch (step?.id) {
      case 0:
        FormStepData = (
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
        );
        break;
      case 1:
        FormStepData = (
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
        );
        break;
      case 2:
        FormStepData = (
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
                            ? (
                                field.state.meta.errors as unknown as {
                                  message: string;
                                }[]
                              )
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
            </form.Question>
          </FormStepContent>
        );
        break;
      case 3:
        FormStepData = (
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
        );
        break;
      case 4:
        FormStepData = (
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
                <Link href={'/settings'} className="text-royal underline">
                  account settings
                </Link>
                .
              </Typography>
            </div>
          </div>
        );
        break;
      default:
        FormStepData = (
          <div>
            <Typography variant="body1">
              Whoops! You aren&apos;t supposed to see this...
            </Typography>
          </div>
        );
        break;
    }
    return (
      <div id={active ? 'active-form-step' : undefined} className="mx-2">
        {FormStepData}
      </div>
    );
  },
});

export default FormStep;

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
