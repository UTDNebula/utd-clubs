'use client';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUploadToUploadURL } from 'src/utils/uploadImage';
import Panel, { PanelSkeleton } from '@src/components/form/Panel';
import { ClubTagEdit } from '@src/components/manage/form/ClubTagEdit';
import FormImage from '@src/components/manage/form/FormImage';
import { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editClubFormSchema } from '@src/utils/formSchemas';

type DetailsProps = {
  club: SelectClub;
};

interface ClubDetails {
  id: string;
  name: string;
  description: string;
  foundingDate: Date | null;
  tags: string[];
  profileImage: File | null;
  bannerImage: File | null;
}

const Details = ({ club }: DetailsProps) => {
  const api = useTRPC();
  const clubQuery = useQuery(
    api.club.details.queryOptions({ id: club.id }, { initialData: club }),
  );
  const editData = useMutation(api.club.edit.data.mutationOptions({}));
  const uploadImage = useUploadToUploadURL();
  const queryClient = useQueryClient();

  const clubDetails = clubQuery.data;
  const defaultValues: ClubDetails = {
    id: clubDetails?.id ?? '',
    name: clubDetails?.name ?? '',
    description: clubDetails?.description ?? '',
    foundingDate: clubDetails?.foundingDate ?? null,
    tags: clubDetails?.tags ?? [],
    profileImage: null,
    bannerImage: null,
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      // Profile image

      const { profileImage, bannerImage, ...formValues } = value;
      let profileImageUrl, bannerImageUrl;
      const profileImageIsDirty =
        !formApi.getFieldMeta('profileImage')?.isDefaultValue;
      if (profileImageIsDirty) {
        if (profileImage === null) {
          value.profileImage = null;
        } else {
          const url = await uploadImage.mutateAsync({
            file: profileImage,
            fileName: `${club.id}-profile`,
          });
          profileImageUrl = url;
        }
      }

      // Banner image
      const bannerImageIsDirty =
        !formApi.getFieldMeta('bannerImage')?.isDefaultValue;
      if (bannerImageIsDirty) {
        if (bannerImage === null) {
          value.bannerImage = null;
        } else {
          const url = await uploadImage.mutateAsync({
            file: bannerImage,
            fileName: `${club.id}-banner`,
          });
          bannerImageUrl = url;
        }
      }

      const updated = await editData.mutateAsync({
        ...formValues,
        bannerImage: bannerImageUrl,
        profileImage: profileImageUrl,
      });
      if (updated) {
        queryClient.invalidateQueries(
          api.club.details.queryOptions({ id: club.id }),
        );
        formApi.reset();
      }
    },
    validators: {
      onChange: editClubFormSchema,
    },
  });

  if (!clubQuery.isSuccess) return <PanelSkeleton />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Panel heading="Details">
        <div className="m-2 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="grow w-48 lg:max-h-96 max-lg:max-h-48">
              <form.Field name="profileImage">
                {(field) => (
                  <FormImage
                    label="Profile Image"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    fallbackUrl={clubDetails!.profileImage ?? undefined}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.handleChange(file);
                    }}
                  />
                )}
              </form.Field>
            </div>
            <div className="grow w-48 lg:max-h-96 max-lg:max-h-48">
              <form.Field name="bannerImage">
                {(field) => (
                  <FormImage
                    label="Banner Image"
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    fallbackUrl={clubDetails!.bannerImage ?? undefined}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.handleChange(file);
                    }}
                  />
                )}
              </form.Field>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <form.Field name="name">
              {(field) => (
                <TextField
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="grow-100 [&>.MuiInputBase-root]:bg-white"
                  size="small"
                  error={!field.state.meta.isValid}
                  helperText={
                    !field.state.meta.isValid
                      ? field.state.meta.errors
                          .map((err) => err?.message)
                          .join('. ') + '.'
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
                  className="grow [&>.MuiPickersInputBase-root]:bg-white"
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
                        .join('. ') + '.'
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

export default Details;
