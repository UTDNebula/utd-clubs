'use client';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { ClubTagEdit } from '@src/components/club/manage/form/ClubTagEdit';
import FormFieldSet from '@src/components/club/manage/form/FormFieldSet';
import type { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editClubSchema } from '@src/utils/formSchemas';

type DetailsProps = {
  club: SelectClub;
};

const Details = ({ club }: DetailsProps) => {
  const api = useTRPC();
  const editData = useMutation(api.club.edit.data.mutationOptions({}));

  const form = useAppForm({
    defaultValues: {
      id: club.id,
      name: club.name,
      description: club.description,
      foundingDate: club.foundingDate,
      tags: club.tags,
      profileImage: club.profileImage,
      bannerImage: club.bannerImage,
    },
    onSubmit: async ({ value }) => {
      await editData.mutateAsync(value);
    },
    validators: {
      onChange: editClubSchema,
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
      <FormFieldSet legend="Details">
        <div className="m-2 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
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
            <form.Field name="foundingDate">
              {(field) => (
                <DatePicker
                  onChange={(value) => field.handleChange(value)}
                  value={field.state.value}
                  label="Date Founded"
                  className="[&>.MuiInputBase-root]:bg-white"
                  slotProps={{
                    actionBar: {
                      actions: ['accept'],
                    },
                    textField: {
                      size: 'small',
                      error: !field.state.meta.isValid,
                      helperText: field.state.meta.isValid
                        ? field.state.meta.errors
                            .map((err) => err?.message)
                            .join('. ')
                        : undefined,
                    },
                  }}
                />
              )}
            </form.Field>
          </div>
          <div className="flex flex-col gap-2">
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
          <form.Field name="tags">
            {(field) => (
              <ClubTagEdit
                value={field.state.value}
                onChange={(value) => {
                  field.handleChange(value);
                }}
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

export default Details;
