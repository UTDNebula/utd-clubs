'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Tooltip } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Panel from '@src/components/common/Panel';
import Confirmation from '@src/components/Confirmation';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
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
  const editSlug = useMutation(
    api.club.edit.slug.mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedName('club listing URL'));
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.errorMessage(error.message));
      },
    }),
  );
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState({
    id: club.id,
    slug: club.slug,
  });

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      const updated = await editSlug.mutateAsync(value);
      if (updated) {
        setDefaultValues({ id: club.id, slug: updated });
        formApi.reset({ id: club.id, slug: updated });
        router.replace(`/manage/${updated}`);
      }
    },
    validators: {
      onChange: editSlugSchema,
    },
  });
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  // Set to true when there is a zod error to prevent fetching
  const [simpleError, setSimpleError] = useState(false);
  const input = useStore(form.store, (state) => state.values.slug);
  const debouncedSearch = useDebounce(input, 300);
  const { data: slugExists, isFetching } = useQuery(
    api.club.slugExists.queryOptions(
      { slug: debouncedSearch },
      {
        enabled:
          !!debouncedSearch && debouncedSearch !== club.slug && !simpleError,
      },
    ),
  );
  const isFetchingOrWaiting = isFetching || debouncedSearch !== input;

  // Update async errors
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
            onChange: [{ message: 'Checking availability..' }],
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
                  err?.message !== 'Checking availability..' &&
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
  }, [club.slug, form, input, isFetchingOrWaiting, slugExists]);

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
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isFetchingOrWaiting || slugExists) {
            return;
          }
          setConfirmationOpen(true);
        }}
      >
        <Panel
          heading="Listing URL"
          description={
            <>
              <p>
                This is the URL of your organization&apos;s listing in the
                directory.
              </p>
              <p>
                Currently it is{' '}
                <Link
                  href={`https://clubs.utdnebula.com/directory/${club.slug}`}
                  className="text-royal dark:text-cornflower-300 underline"
                >{`https://clubs.utdnebula.com/directory/${club.slug}`}</Link>
                .
              </p>
              <p>
                Your URL may only use lowercase letters, numbers, and dashes.
              </p>
            </>
          }
        >
          <div className="m-2 mt-0 flex flex-col gap-4">
            <form.AppField
              name="slug"
              validators={{
                onChange: ({ value }) => {
                  const result = editSlugSchema.shape.slug.safeParse(value);
                  const normalizeToArray = result.success
                    ? []
                    : result.error.issues.map((issue) => ({
                        message: issue.message,
                      }));
                  setSimpleError(normalizeToArray.length !== 0);
                  return normalizeToArray;
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
                  <field.TextField
                    label="URL"
                    className="w-full"
                    disabled={role !== 'President'}
                    error={
                      !field.state.meta.isValid &&
                      !field.state.meta.isValidating
                    }
                    helperText={helperText(field.state.meta.errors)}
                  />
                </Tooltip>
              )}
            </form.AppField>
          </div>
          <div className="flex flex-wrap justify-end items-center gap-2">
            <form.AppForm>
            <form.ResetButton
              onClick={() => {
                form.reset();
              }}
            />
            </form.AppForm>
            <form.AppForm>
              <form.SubmitButton />
            </form.AppForm>
          </div>
        </Panel>
      </form>
      <Confirmation
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        contentText="Changing your URL will reload the page and discard changes to other forms."
        confirmText="Change"
        confirmColor="primary"
        onConfirm={form.handleSubmit}
        loading={isSubmitting}
      />
    </>
  );
};

export default Slug;
