'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import Form from '@src/components/club/manage/components/Form';
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
          <FormInput
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
          />
        </div>
        <div className="flex flex-wrap">
          <FormInput
            type="text"
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            className="flex-1/2"
          />
          <FormInput
            type="date"
            label="Founded"
            // name="founded"
            register={register}
          />
        </div>
        <FormTextArea
          label="Description"
          name="description"
          register={register}
          error={errors.description}
          required
        />
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Details;
