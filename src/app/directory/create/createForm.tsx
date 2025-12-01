'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import ContactSelector from '@src/app/directory/create/CreateContactSelector';
import OfficerSelector from '@src/app/directory/create/OfficerSelector';
import { useTRPC } from '@src/trpc/react';
import { createClubSchema } from '@src/utils/formSchemas';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import PreviewComponent from '@src/app/directory/create/PreviewComponent';


const CreateClubForm = ({ user }: { user: { id: string; name: string } }) => {
 const {
   register,
   control,
   handleSubmit,
   watch,
   formState: { errors },
 } = useForm<z.infer<typeof createClubSchema>>({
   resolver: zodResolver(createClubSchema),
   defaultValues: {
     name: '',
     description: '',
     officers: [
       {
         id: user.id,
         name: user.name,
         president: true,
         locked: true,
         position: 'President',
       },
     ],
     contacts: [],
   },
 });


 const formData = watch();
 const router = useRouter();
 const api = useTRPC();
 const createClub = useMutation(
   api.club.create.mutationOptions({
     onSuccess: (slug) => router.push(`/directory/${slug}`),
   }),
 );


 const submitForm = handleSubmit((data) => {
   if (!createClub.isPending) createClub.mutate(data);
 });


 return (
   <form onSubmit={submitForm}>
     <div className="flex flex-col gap-4 p-4">
       <div className="rounded-sm bg-slate-100 p-4 shadow-sm">
         <h1 className="mb-2 text-2xl font-bold text-gray-800">
           Create New Organization
         </h1>
       </div>


       <div className="rounded-sm bg-slate-100 p-4 shadow-sm">
         <h2 className="mb-2 text-lg font-semibold">Organization Name</h2>
         <input
           type="text"
           id="name"
           className="w-full rounded-sm border border-gray-300 bg-white p-2"
           {...register('name')}
           aria-invalid={errors.name ? 'true' : 'false'}
         />
         {errors.name && <p className="text-red-500">{errors.name.message}</p>}
       </div>


       <div className="rounded-sm bg-slate-100 p-4 shadow-sm">
         <h2 className="mb-2 text-lg font-semibold">Description</h2>
         <textarea
           id="description"
           rows={4}
           className="w-full rounded-sm border border-gray-300 bg-white p-2"
           {...register('description')}
           aria-invalid={errors.description ? 'true' : 'false'}
         />
         {errors.description && (
           <p className="text-red-500">{errors.description.message}</p>
         )}
       </div>


       <div className="w-full rounded-md bg-slate-100 p-5 shadow-xs">
         <OfficerSelector
           control={control}
           register={register}
           errors={errors}
         />
       </div>


       <div className="w-full rounded-md bg-slate-100 p-5 shadow-xs">
         <ContactSelector
           control={control}
           register={register}
           errors={errors}
         />
       </div>
       <div className="w-full rounded-md bg-slate-100 p-5 shadow-xs">
         <h3 className="mx-left mb-2 mt-6 text-2xl font-bold text-gray-800">
           Live Preview
         </h3>
       <PreviewComponent formData={formData} />
       </div>
       <button
         type="submit"
         disabled={createClub.isPending}
         className="mx-auto w-sm rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
       >
         {createClub.isPending ? 'Creating...' : 'Submit'}
       </button>
     </div>
   </form>
 );
};


export default CreateClubForm;