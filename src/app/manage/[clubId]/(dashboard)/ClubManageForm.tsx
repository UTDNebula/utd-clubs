'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import { FormFieldSet } from '@src/components/club/manage/FormComponents';
// import PillButton from '@src/components/PillButton';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editClubSchema } from '@src/utils/formSchemas';
import Details from './(forms)/Details';

const ClubManageForm = ({
  club,
}: {
  club: SelectClub & { contacts: SelectContact[] };
}) => {
  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors, isDirty },
  // } = useForm<z.infer<typeof editClubSchema>>({
  //   resolver: zodResolver(editClubSchema),
  //   defaultValues: {
  //     id: club.id,
  //     name: club.name,
  //     description: club.description,
  //   },
  //   mode: 'onTouched',
  //   // mode: 'all',
  //   // mode: 'onSubmit',
  // });

  // const methods = useForm<z.infer<typeof editClubSchema>>({
  //   resolver: zodResolver(editClubSchema),
  //   defaultValues: {
  //     id: club.id,
  //     name: club.name,
  //     description: club.description,
  //   },
  //   mode: 'onTouched',
  // });

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors, isDirty },
  // } = methods;

  // const router = useRouter();
  // const api = useTRPC();
  // const editData = useMutation(
  //   api.club.edit.data.mutationOptions({
  //     onSuccess: () => {
  //       router.refresh();
  //     },
  //   }),
  // );

  // const submitForm = handleSubmit((data) => {
  //   window.alert(JSON.stringify(data));
  //   console.log(JSON.stringify(data));
  //   // if (!editData.isPending) {
  //   //   editData.mutate(data);
  //   // }
  // });

  // const submitForm = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   handleSubmit((data) => {
  //     window.alert(JSON.stringify(data));
  //     if (!editData.isPending) {
  //       editData.mutate(data);
  //     }
  //   });
  // };

  return <Details club={club} />;

  // return (
  //   <FormProvider {...methods}>
  //     <form
  //       className="flex flex-col gap-8 pb-8"
  //       // onSubmit={() => {
  //       //   void submitForm;
  //       // }}

  //       // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //       onSubmit={submitForm}
  //     >
  //       <FormFieldSet legend="Edit Details">
  //         <Details />
  //         {/* <div className="flex flex-wrap">
  //           <FormInput
  //             type="file"
  //             label="Logo"
  //             // name="logo"
  //             register={register}
  //           />
  //           <FormInput
  //             type="file"
  //             label="Banner"
  //             // name="banner"
  //             register={register}
  //           />
  //         </div>
  //         <div className="flex flex-wrap">
  //           <FormInput
  //             type="text"
  //             label="Name"
  //             name="name"
  //             register={register}
  //             error={errors.name}
  //             className="flex-1/2"
  //           />
  //           <FormInput
  //             type="date"
  //             label="Founded"
  //             // name="founded"
  //             register={register}
  //           />
  //         </div>
  //         <FormTextArea
  //           label="Description"
  //           name="description"
  //           register={register}
  //           error={errors.description}
  //           required
  //         />
  //         <FormButtons /> */}
  //       </FormFieldSet>
  //       <FormFieldSet legend="Edit Officers"></FormFieldSet>
  //     </form>
  //   </FormProvider>
  // );
  // return <TestForm2 />
};

export default ClubManageForm;
