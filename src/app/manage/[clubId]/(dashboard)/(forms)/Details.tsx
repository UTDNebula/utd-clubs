'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import Form from '@src/components/club/manage/form/Form';
import FormButtons from '@src/components/club/manage/form/FormButtons';
import FormDatePicker from '@src/components/club/manage/form/FormDatePicker';
import FormFieldSet from '@src/components/club/manage/form/FormFieldSet';
import FormImageUpload from '@src/components/club/manage/form/FormImageUpload';
import FormTextField from '@src/components/club/manage/form/FormTextField';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editClubSchema } from '@src/utils/formSchemas';

const Details = ({
  club,
}: {
  club: SelectClub & { contacts: SelectContact[] };
}) => {
  const methods = useForm<z.infer<typeof editClubSchema>>({
    resolver: zodResolver(editClubSchema),
    // defaultValues: club,
    defaultValues: {
      ...club,
      ...{
        profileImage: club.profileImage ?? undefined,
        bannerImage: club.bannerImage ?? undefined,
        foundingDate: club.foundingDate ?? undefined,
      },
    },
    // defaultValues: {
    //   id: club.id,
    //   name: club.name,
    //   description: club.description,
    //   profileImage: club.profileImage ?? undefined,
    //   bannerImage: club.bannerImage ?? undefined,
    //   foundingDate: club.foundingDate ?? undefined,
    //   tags: club.tags,
    // },
    mode: 'onTouched',
  });

  const { handleSubmit, control } = methods;

  const router = useRouter();
  const api = useTRPC();
  const editData = useMutation(
    api.club.edit.data.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );

  const submitForm = handleSubmit((data) => {
    if (!editData.isPending) {
      editData.mutate(data);
    }
  });

  return (
    <Form methods={methods} onSubmit={submitForm}>
      <FormFieldSet legend="Edit Details">
        {/* Error Display */}
        {editData.isError && (
          <Alert severity="error" className="mb-4">
            {editData.error?.message ??
              'An error occurred while saving details.'}
          </Alert>
        )}
        <FormImageUpload
          name="profileImage"
          {...{ control }}
          label="Logo"
          clubId={club.id}
        />
        <div className="flex flex-wrap">
          <FormTextField
            name="logo"
            label="Logo"
            // {...{ control }}
            slotProps={{
              htmlInput: { type: 'file' },
              inputLabel: { shrink: true },
            }}
          />
          <FormTextField
            name="banner"
            label="Banner"
            // {...{ control }}
            slotProps={{
              htmlInput: { type: 'file' },
              inputLabel: { shrink: true },
            }}
          />
        </div>
        <div className="flex flex-wrap">
          <FormTextField
            name="name"
            label="Name"
            className="flex-1/2"
            {...{ control }}
          />
          <FormDatePicker
            name="foundingDate"
            label="Date Founded"
            {...{ control }}
          />
        </div>
        <FormTextField
          name="description"
          label="Description"
          {...{ control }}
          multiline
          minRows={4}
        />
        <FormButtons
          isPending={editData.isPending}
          onClickDiscard={() => {
            // console.log({ isDirty: methods.formState.isDirty });
            console.log('Discard!');
            methods.reset();
            console.log({ club });
            const values = methods.getValues();
            console.log({ values });
            console.log(club == values);
            console.log(club === values);
            console.log({ dirtyFields: methods.formState.dirtyFields });
          }}
        />
      </FormFieldSet>
    </Form>
  );
};

export default Details;
