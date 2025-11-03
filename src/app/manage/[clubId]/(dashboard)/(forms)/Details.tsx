'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  useForm,
  useFormContext,
  // type FieldErrors,
  // type FieldValues,
  // type UseFormRegister,
} from 'react-hook-form';
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

// type DetailsProps<TFormValues extends FieldValues> = {
//   register?: UseFormRegister<TFormValues>;
//   errors?: FieldErrors<TFormValues>;
// };

const Details = ({
  club,
  // editData,
}: {
  club: SelectClub & { contacts: SelectContact[] };
  // editData: UseMutationResult<{ [key: string]: unknown }, Error, string, unknown>;
}) =>
  // const Details = <TFormValues extends FieldValues>(
  // {
  //   // register,
  //   // errors,
  //   // control,
  // }: DetailsProps<TFormValues> ,
  {
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
    // const { field } = useController({ name: "description", control });
    // const {
    //   register,
    //   formState: { errors },
    // } = useFormContext<z.infer<typeof editClubSchema>>();

    // const {
    //   register,
    //   formState: { errors },
    // } = useFormContext<z.infer<typeof editClubSchema>>();

    // const methods = useForm<z.infer<typeof editClubSchema>>({
    //   resolver: zodResolver(editClubSchema),
    //   defaultValues: {
    //     id: club.id,
    //     name: club.name,
    //     description: club.description,
    //   },
    //   mode: 'onTouched',
    // });

    // const methods = useFormContext<z.infer<typeof editClubSchema>>();
    // const {
    //   register,
    //   handleSubmit,
    //   reset,
    //   formState: { errors, isDirty },
    // } = methods;
    // const {
    //   register,
    //   formState: { errors },
    // } = useFormContext();

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
