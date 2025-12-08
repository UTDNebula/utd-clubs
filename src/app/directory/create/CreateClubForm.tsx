'use client';

import { TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import FormFieldSet from '@src/components/club/manage/form/FormFieldSet';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { createClubSchema } from '@src/utils/formSchemas';

const CreateClubForm = () => {
  const api = useTRPC();
  const createClub = useMutation(api.club.create.mutationOptions({}));
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      const clubId = await createClub.mutateAsync(value);
      router.push(`/manage/${clubId}`);
    },
    validators: {
      onChange: createClubSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormFieldSet legend="Create New Organization">
        <div className="ml-2 mb-4 text-slate-600 text-sm">
          <p>
            We&apos;ll start with the basics then get your organization&apos;s
            logo, officers, contact information, and collaborators on the next
            page.
          </p>
        </div>
        <div className="m-2 mt-0 flex flex-col gap-4">
          <form.Field name="name">
            {(field) => (
              <TextField
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="grow [&>.MuiInputBase-root]:bg-white"
                size="small"
                error={!field.state.meta.isValid}
                helperText={
                  !field.state.meta.isValid
                    ? field.state.meta.errors
                        .map((err) => err?.message)
                        .join('. ')
                    : undefined
                }
                label="Name"
              />
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <TextField
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                onBlur={field.handleBlur}
                value={field.state.value}
                label="Description"
                className="[&>.MuiInputBase-root]:bg-white"
                multiline
                minRows={4}
                error={!field.state.meta.isValid}
                helperText={
                  !field.state.meta.isValid ? (
                    field.state.meta.errors
                      .map((err) => err?.message)
                      .join('. ')
                  ) : (
                    <span>
                      We support{' '}
                      <a
                        href="https://www.markdownguide.org/basic-syntax/"
                        rel="noreferrer"
                        target="_blank"
                        className="text-royal underline"
                      >
                        Markdown
                      </a>
                      !
                    </span>
                  )
                }
              />
            )}
          </form.Field>
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.FormResetButton />
          </form.AppForm>
          <form.AppForm>
            <form.FormSubmitButton />
          </form.AppForm>
        </div>
      </FormFieldSet>
    </form>
  );
};
export default CreateClubForm;
