'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Panel from '@src/components/common/Panel';
import { ClubTagEdit } from '@src/components/manage/form/ClubTagEdit';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { createClubSchema } from '@src/utils/formSchemas';

type CreateClubSchema = z.infer<typeof createClubSchema>;

const CreateClubForm = () => {
  const api = useTRPC();
  const createClub = useMutation(api.club.create.mutationOptions({}));
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
      tags: [],
    } as CreateClubSchema,
    onSubmit: async ({ value }) => {
      const slug = await createClub.mutateAsync(value);
      router.push(`/manage/${slug}`);
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
      <Panel heading="Create New Organization">
        <div className="ml-2 mb-4 text-slate-600 dark:text-slate-400 text-sm">
          <p>
            We&apos;ll start with the basics then get your organization&apos;s
            logo, officers, contact information, and collaborators on the next
            page.
          </p>
        </div>
        <div className="m-2 mt-0 flex flex-col gap-4">
          <form.AppField name="name">
            {(field) => (
              <field.TextField label="Name" className="grow" required />
            )}
          </form.AppField>
          <form.AppField name="description">
            {(field) => (
              <field.TextField
                label="Description"
                className="w-full"
                multiline
                minRows={4}
                helperText={
                  !field.state.meta.isValid ? (
                    field.state.meta.errors
                      .map((err) => err?.message)
                      .join('. ') + '.'
                  ) : (
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
                  )
                }
              />
            )}
          </form.AppField>
          <form.Field name="tags">
            {(field) => (
              <ClubTagEdit
                value={field.state.value}
                onChange={(value) => {
                  field.handleChange(value);
                }}
                onBlur={field.handleBlur}
                error={field.state.meta.isTouched && !field.state.meta.isValid}
                helperText={
                  field.state.meta.isTouched && !field.state.meta.isValid
                    ? field.state.meta.errors
                        .map((err) => err?.message)
                        .join('. ') + '.'
                    : undefined
                }
              />
            )}
          </form.Field>
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
};
export default CreateClubForm;
