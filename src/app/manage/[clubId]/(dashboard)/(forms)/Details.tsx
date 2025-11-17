'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import Form from '@src/components/club/manage/components/Form';
import FormFileUpload from '@src/components/club/manage/components/FormFileUpload';
import FormDatePicker from '@src/components/club/manage/form/FormDatePicker';
import FormTextField from '@src/components/club/manage/form/FormTextField';
import {
  FormButtons,
  FormFieldSet,
  FormInput,
  FormTextArea,
} from '@src/components/club/manage/FormComponents';
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
    defaultValues: {
      id: club.id,
      name: club.name,
      description: club.description,
    },
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = methods;

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
    window.alert(JSON.stringify(data));
    console.log(JSON.stringify(data));
    if (!editData.isPending) {
      editData.mutate(data);
    }
  });

  return (
    <Form
      methods={methods}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={submitForm}
    >
      <FormFieldSet legend="Edit Details">
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
          {/* <FormInput
            type="file"
            label="Logo"
            // name="logo"
            register={register}
          />
          <FormInput
            type="file"
            label="Banner"
            // name="banner"
            register={register}
          /> */}
        </div>
        <div className="flex flex-wrap">
          <FormTextField
            name="name"
            label="Name"
            className="flex-1/2"
            {...{ control }}
          />

          {/* <Controller
            name="name"
            render={({ field }) => (
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                size="small"
                {...field}
                required
                error={!!errors.name}
                helperText={errors.name && errors.name.message}
              />
            )}
          /> */}
          {/* <FormInput
            type="text"
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            className="flex-1/2"
          /> */}
          <FormDatePicker
            name="founded"
            label="Date Founded"
            // {...{ control }}
          />
          {/* <FormInput
            type="date"
            label="Founded"
            // name="founded"
            register={register}
          /> */}
        </div>
        <FormTextField
          name="description"
          label="Description"
          {...{ control }}
          multiline
          minRows={4}
        />
        {/* <FormTextArea
          label="Description"
          name="description"
          register={register}
          error={errors.description}
          required
        /> */}
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Details;
