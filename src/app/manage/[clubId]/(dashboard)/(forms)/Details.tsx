'use client';

import {
  useFormContext,
  // type FieldErrors,
  // type FieldValues,
  // type UseFormRegister,
} from 'react-hook-form';
import type z from 'zod';
// import FormTextArea from '@src/components/club/manage/components/FormTextArea';
import {
  FormButtons,
  FormInput,
  FormTextArea,
} from '@src/components/club/manage/FormComponents';
import { type editClubSchema } from '@src/utils/formSchemas';

// type DetailsProps<TFormValues extends FieldValues> = {
//   register?: UseFormRegister<TFormValues>;
//   errors?: FieldErrors<TFormValues>;
// };

const Details = () =>
  // const Details = <TFormValues extends FieldValues>(
  // {
  //   // register,
  //   // errors,
  //   // control,
  // }: DetailsProps<TFormValues>,
  {
    // const { field } = useController({ name: "description", control });
    // const {
    //   register,
    //   formState: { errors },
    // } = useFormContext<z.infer<typeof editClubSchema>>();

    const {
      register,
      formState: { errors },
    } = useFormContext<z.infer<typeof editClubSchema>>();
    // const {
    //   register,
    //   formState: { errors },
    // } = useFormContext();

    return (
      <>
        {/* <h1>hi</h1> */}
        {/* <input {...register('name')} /> */}
        {/* <FormInput
          type="file"
          label="Logo"
          // name="logo"
          register={register}
        />
        <FormInput
          type="text"
          label="Name"
          name="name"
          register={register}
          error={errors.name}
          className="flex-1/2"
        />
        <FormTextArea
          label="Description"
          name="description"
          register={register}
          error={errors.description}
          required
        />

        <input type="submit" /> */}
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
      </>
    );
  };

export default Details;
