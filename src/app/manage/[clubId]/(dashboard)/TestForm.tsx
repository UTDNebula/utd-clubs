'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import FormTextArea from '@src/components/club/manage/components/FormTextArea';
// import FormFieldSet from '@src/components/club/manage/components/FormFieldSet';
// import FormInput from '@src/components/club/manage/FormInput';
import {
  FormInput,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import type { SelectClub, SelectContact } from '@src/server/db/models';
// import { editClubSchema } from '@src/utils/formSchemas';
import { type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

const testSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(1),
  num: z.number().min(5).max(10),
  bool: z.boolean(),
  founded: z.string(),
  active: z.string(),
  logo: z.file(),
  banner: z.file(),
});

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
    // } = useForm<z.infer<typeof editClubSchema>>({
    //   resolver: zodResolver(editClubSchema),
  } = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      id: club.id,
      name: 'club.name',
      description: 'club.description',
    },
    // defaultValues: {
    //   id: club.id,
    //   name: club.name,
    //   description: club.description,
    // },
  });

  // const onSubmit: SubmitHandler<z.infer<typeof editClubSchema>> = (data) => {
  //   alert(JSON.stringify(data));
  // };

  return (
    <form className="flex flex-col gap-8 pb-8">
      <FormFieldSet legend="Edit Details">
        <div className="flex flex-wrap">
          <FormInput type="file" label="Logo" name="logo" register={register} />
          <FormInput
            type="file"
            label="Banner"
            name="banner"
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
          <FormInput
            type="text"
            label="Founded"
            name="founded"
            register={register}
            required
          />
          <FormInput
            type="text"
            label="Active"
            name="active"
            register={register}
          />
        </div>
        {/* <FormInput
          type="textarea"
          label="Description"
          name="description"
          register={register}
        /> */}
        <FormTextArea
          label="Description"
          name="description"
          register={register}
        />

        <FormInput
          type="checkbox"
          label="Checkbox 1"
          name="bool"
          register={register}
        />
        <FormInput
          type="checkbox"
          label="Checkbox 2"
          name="bool"
          register={register}
        />
        <FormInput
          type="checkbox"
          label="Checkbox 3"
          name="bool"
          register={register}
        />

        {/* <FormInput
          type="button"
          onClick={() => {
            window.alert('button press');
          }}
          label="Button"
          name="bool"
          register={register}
        /> */}

        <FormInput />
        {/* <FormInput type="text" name="test" /> */}
        {/* </fieldset> */}
      </FormFieldSet>
      <FormFieldSet legend="Edit Officers">
        <FormInput
          type="text"
          label="Name"
          name="name"
          register={register}
          className="flex-1/2"
        />
        <FormInput
          type="color"
          label="Color"
          name="name"
          register={register}
          className="flex-1/2"
        />
      </FormFieldSet>
    </form>
  );
};

export default ClubManageForm;
