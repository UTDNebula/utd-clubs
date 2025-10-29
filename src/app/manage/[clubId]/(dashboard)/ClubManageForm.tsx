'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import FormTextArea from '@src/components/club/manage/components/FormTextArea';
import {
  FormInput,
  FormFieldSet,
  FormButtons,
} from '@src/components/club/manage/FormComponents';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { editClubSchema } from '@src/utils/formSchemas';
import { useTRPC } from '@src/trpc/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type z } from 'zod';
import { type FormEvent } from 'react';
import {
  formComponentBaseStyle,
  formLabelBaseStyle,
  labelPositionStyle,
} from '@src/components/club/manage/components/FormBase';
import PillButton from '@src/components/PillButton';

const ClubManageForm = ({
  club,
}: {
  club: SelectClub & { contacts: SelectContact[] };
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof editClubSchema>>({
    resolver: zodResolver(editClubSchema),
    defaultValues: {
      id: club.id,
      name: club.name,
      description: club.description,
    },
    // mode: 'onChange',
    // mode: 'all',
    mode: 'onSubmit',
  });

  const router = useRouter();
  const api = useTRPC();
  const editData = useMutation(
    api.club.edit.data.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );

  // console.log('errors:');
  // console.log(errors);

  const submitForm = handleSubmit((data) => {
    window.alert(JSON.stringify(data));
    console.log(JSON.stringify(data));
    if (!editData.isPending) {
      editData.mutate(data);
    }
  });

  // const submitForm = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   handleSubmit((data) => {
  //     window.alert(JSON.stringify(data));
  //     if (!editData.isPending) {
  //       editData.mutate(data);
  //     }
  //   });
  // };

  return (
    <form
      className="flex flex-col gap-8 pb-8"
      // onSubmit={() => {
      //   void submitForm;
      // }}

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
            className="flex-1/2"
          />
          {/* <span className="text-xs text-red-500">hi</span> */}
          {errors.name && (
            <span className="text-xs text-red-500">
              hi{errors.name?.message}
            </span>
          )}
          <FormInput
            type="text"
            label="Founded"
            // name="founded"
            register={register}
          />
          {/* <FormInput
            type="text"
            label="Active"
            // name="active"
            register={register}
          /> */}
        </div>
        <FormTextArea
          label="Description"
          name="description"
          register={register}
          aria-invalid={!!errors.description}
          required
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <p className="text-red-500">{errors.description?.message}</p>

        <FormButtons />
      </FormFieldSet>
      <FormFieldSet legend="Edit Officers"></FormFieldSet>
    </form>
  );
};

export default ClubManageForm;
