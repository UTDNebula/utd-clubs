'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { TextField, Tooltip } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FormFieldSet from '@src/components/form/FormFieldSet';
import type { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editSlugSchema } from '@src/utils/formSchemas';
import useDebounce from '@src/utils/useDebounce';

type DetailsProps = {
  club: SelectClub;
  role: 'Officer' | 'President';
};

const Slug = ({ club, role }: DetailsProps) => {
  const api = useTRPC();
  const editSlug = useMutation(api.club.edit.slug.mutationOptions({}));

  const [defaultValues, setDefaultValues] = useState({
    id: club.id,
    slug: club.slug,
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      const updated = await editSlug.mutateAsync(value);
      if (updated) {
        setDefaultValues({ id: club.id, slug: updated });
        formApi.reset({ id: club.id, slug: updated });
      }
    },
    validators: {
      onChange: editSlugSchema,
    },
  });

  // Check if taken
  const [input, setInput] = useState(club.slug);
  const debouncedSearch = useDebounce(input, 300);
  const { data: slugExists, isFetching } = useQuery(
    api.club.slugExists.queryOptions(
      { slug: debouncedSearch },
      { enabled: !!debouncedSearch },
    ),
  );
  const isFetchingOrWaiting = isFetching || debouncedSearch !== input;

  useEffect(() => {
    // Input has changed
    const isNewSlug = input !== club.slug;

    // Loading
    if (isNewSlug && isFetchingOrWaiting) {
      form.setFieldMeta('slug', (prev) => {
        // Preserve existing errors
        if (prev.errorMap.onChange?.length) return prev;
        return {
          ...prev,
          errorMap: {
            onChange: [{ message: 'Checking availability…' }],
          },
          isValidating: true,
        };
      });
      return;
    }

    // Taken
    if (isNewSlug && slugExists && !isFetchingOrWaiting) {
      form.setFieldMeta('slug', (prev) => {
        // Preserve existing errors
        if (prev.errorMap.onChange?.length) return prev;
        return {
          ...prev,
          errorMap: {
            onChange: [
              ...(prev.errorMap.onChange || []),
              { message: 'This slug is already taken' },
            ],
          },
          isValid: false,
          isValidating: false,
        };
      });
      return;
    }

    // Success, remove async errors
    if (isNewSlug && !slugExists && !isFetchingOrWaiting) {
      form.setFieldMeta('slug', (prev) => {
        return {
          ...prev,
          errorMap: {
            onChange:
              prev.errorMap.onChange?.filter(
                (err: { message?: string } | undefined) =>
                  err?.message !== 'Checking availability…' &&
                  err?.message !== 'This slug is already taken',
              ) ?? [],
          },
          isValidating: false,
        };
      });
      return;
    }

    // Default
    if (!isNewSlug) {
      form.setFieldMeta('slug', (prev) => ({
        ...prev,
        isValidating: false,
      }));
    }
  }, [input, isFetchingOrWaiting, slugExists]);

  // Show first error
  const helperText = (errors: ({ message?: string } | undefined)[]) => {
    const stringErrors = errors
      .map((error) => error?.message)
      .filter((error) => typeof error === 'string');
    if (stringErrors.length) {
      return stringErrors[0] === 'This slug is already taken' ? (
        <span className="flex items-center gap-1">
          <WarningIcon fontSize="inherit" />
          {`${input} is already taken.`}
        </span>
      ) : (
        <span>
          {stringErrors[0]}
          {'. '}
        </span>
      );
    }
    if (input !== club.slug) {
      return (
        <span className="flex items-center gap-1 text-green-700">
          <CheckCircleIcon fontSize="inherit" />
          {`${input} is available.`}
        </span>
      );
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFetchingOrWaiting || slugExists) {
          return;
        }
        form.handleSubmit();
      }}
    >
      <FormFieldSet legend="Listing URL">
        <div className="ml-2 mb-4 text-slate-600 text-sm">
          <p>
            This is the URL of your organization&apos;s listing in the
            directory.
          </p>
          <p>
            Currently it is{' '}
            <Link
              href={`https://clubs.utdnebula.com/directory/${club.slug}`}
              className="text-royal underline"
            >{`https://clubs.utdnebula.com/directory/${club.slug}`}</Link>
            .
          </p>
          <p>Your URL may only use lowercase letters, numbers, and dashes.</p>
        </div>
        <div className="m-2 mt-0 flex flex-col gap-4">
          <form.Field
            name="slug"
            validators={{
              onChange: ({ value }) => {
                const result = editSlugSchema.shape.slug.safeParse(value);
                return (
                  (result.success
                    ? undefined
                    : result.error.issues.map((issue) => ({
                        message: issue.message,
                      }))) ?? []
                );
              },
            }}
          >
            {(field) => (
              <Tooltip
                title={
                  role !== 'President'
                    ? 'Only an admin can change the club URL'
                    : undefined
                }
              >
                <TextField
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setInput(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  label="URL"
                  className="[&>.MuiInputBase-root]:bg-white"
                  size="small"
                  disabled={role !== 'President'}
                  error={
                    !field.state.meta.isValid && !field.state.meta.isValidating
                  }
                  helperText={helperText(field.state.meta.errors)}
                />
              </Tooltip>
            )}
          </form.Field>
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.FormResetButton
              onClick={() => {
                form.reset();
                setInput(form.getFieldValue('slug'));
              }}
            />
          </form.AppForm>
          <form.AppForm>
            <form.FormSubmitButton />
          </form.AppForm>
        </div>
      </FormFieldSet>
    </form>
  );
};

export default Slug;
