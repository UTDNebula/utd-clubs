'use client';

import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import ClubTagAutocomplete from '@src/components/club/ClubTagAutocomplete';
import { WizardRef } from '@src/components/form/FormWizard';
import { AppRouter } from '@src/server/api/root';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { createClubSchema, CreateClubSchema } from '@src/utils/formSchemas';

const CreateClubForm = () => {
  const api = useTRPC();
  const createClub = useMutation(api.club.create.mutationOptions({}));
  const router = useRouter();

  const [slug, setSlug] = useState('');
  const [error, setError] = useState<
    TRPCClientErrorLike<AppRouter> | undefined
  >();

  const wizardRef = useRef<WizardRef>(null);

  const form = useAppForm({
    defaultValues: {
      name: { name: '', alias: '' },
      meta: {
        description: '',
        tags: [],
      },
    } as CreateClubSchema,
    onSubmit: async ({ value }) => {
      const slug = await createClub.mutateAsync(value, {
        onError: async (error) => {
          setError(error);
          const targetErrorSuccess =
            await wizardRef.current?.dispatchWizardAction('target', {
              targetStep: 'error',
              noValidate: true,
              allowDisabled: true,
            });
          if (!targetErrorSuccess)
            throw new Error('Failed to show step with error message');
        },
      });
      setSlug(slug);
    },
    validators: {
      onChange: createClubSchema,
    },
  });

  return (
    <form.AppForm>
      <form.Wizard
        onComplete={() => {
          router.push(`/manage/${slug}`);
        }}
        ref={wizardRef}
      >
        <form.WizardStep<CreateClubSchema>
          name="name"
          label="Name"
          backButtonConfig={{
            label: 'Cancel',
            onClick: () => {
              router.back();
            },
          }}
        >
          <form.Question
            question="What is your student organization called?"
            className="w-full items-center text-center"
          >
            <div className="flex w-full flex-row flex-wrap justify-center gap-4">
              <form.AppField name="name.name">
                {(field) => (
                  <field.TextField
                    label="Organization Name"
                    className="w-full max-w-md"
                    size="medium"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name="name.alias">
                {(field) => (
                  <field.TextField
                    label="Alias or Acronym"
                    className="w-full max-w-48"
                    size="medium"
                    helperText="Optional"
                  />
                )}
              </form.AppField>
            </div>
          </form.Question>
        </form.WizardStep>

        <form.WizardStep<CreateClubSchema>
          name="meta"
          label="Basic Info"
          nextButtonConfig={{ label: 'Create', type: 'submitAndNext' }}
        >
          <form.Question
            question="Describe your organization so people can discover it easier!"
            className="w-full items-center text-center"
          >
            <form.AppField name="meta.description">
              {(field) => (
                <field.TextField
                  label="Description"
                  className="w-full"
                  multiline
                  minRows={4}
                  helperText={
                    <span>
                      We support{' '}
                      <a
                        href="https://www.markdownguide.org/basic-syntax/"
                        rel="noreferrer"
                        target="_blank"
                        className="text-royal dark:text-cornflower-300 underline"
                      >
                        Markdown
                      </a>
                      !
                    </span>
                  }
                />
              )}
            </form.AppField>
            <form.Field name="meta.tags">
              {(field) => (
                <ClubTagAutocomplete
                  allowAddingOptions
                  className="w-full"
                  value={field.state.value}
                  onChange={(value) => {
                    field.handleChange(value);
                  }}
                  onBlur={field.handleBlur}
                  error={!field.state.meta.isValid}
                  helperText={
                    !field.state.meta.isValid
                      ? field.state.meta.errors
                          .map((err) => err?.message)
                          .join('. ') + '.'
                      : undefined
                  }
                />
              )}
            </form.Field>
          </form.Question>
        </form.WizardStep>

        <form.WizardStep
          name="error"
          disabled
          hidden
          noAdvance
          noBacktrack
          backButtonConfig={{
            label: 'Try again',
            type: 'restart',
            disabled: false,
          }}
          nextButtonConfig={{
            label: 'Oh, okay',
            type: 'none',
            disabled: false,
            onClick: () => {
              router.back();
            },
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <ErrorIcon color="error" fontSize="inherit" className="text-6xl" />
            <Typography
              variant="h2"
              color="error"
              className="font-display text-center text-2xl font-bold"
            >
              Could not create organization
            </Typography>
            <Typography variant="body1" className="max-w-lg text-center">
              There was an error creating your organization
              {error?.message ? (
                <>
                  :
                  <br />
                  {error?.message}
                </>
              ) : (
                '.'
              )}
              <br />
              Please ask for support in{' '}
              <a
                href="https://discord.utdnebula.com/"
                rel="noreferrer"
                target="_blank"
                className="text-royal dark:text-cornflower-300 underline"
              >
                Nebula Labs&apos;s Discord server
              </a>
            </Typography>
          </div>
        </form.WizardStep>

        <form.WizardStep
          name="customize"
          label="Customize"
          noBacktrack
          backButtonConfig={{ hidden: true }}
          nextButtonConfig={{ label: 'Continue', type: 'next' }}
        >
          <div className="flex flex-col items-center gap-6">
            <Typography
              variant="h2"
              className="font-display text-center text-2xl font-bold"
            >
              Organization successfully created!
            </Typography>
            <Typography
              variant="body1"
              className="max-w-lg text-center text-neutral-800 dark:text-neutral-200"
            >
              Click continue to go to your organization&apos;s customization
              page, where you can add additional organization information, list
              your officers, and add contact info.
            </Typography>
          </div>
        </form.WizardStep>
      </form.Wizard>
    </form.AppForm>
  );
};
export default CreateClubForm;
