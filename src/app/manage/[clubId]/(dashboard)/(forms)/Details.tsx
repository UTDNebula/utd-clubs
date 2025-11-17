'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import Form from '@src/components/club/manage/form/Form';
import FormDatePicker from '@src/components/club/manage/form/FormDatePicker';
import FormTextField from '@src/components/club/manage/form/FormTextField';
import {
  FormButtons,
  FormFieldSet,
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
        </div>
        <div className="flex flex-wrap">
          <FormTextField
            name="name"
            label="Name"
            className="flex-1/2"
            {...{ control }}
          />
          <FormDatePicker
            name="founded"
            label="Date Founded"
            // {...{ control }}
          />
        </div>
        <FormTextField
          name="description"
          label="Description"
          {...{ control }}
          multiline
          minRows={4}
        />
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Details;
