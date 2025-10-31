'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import nebulaPic from 'public/nebula-logo.png';
import { useState, type FormEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { useTRPC } from '@src/trpc/react';
import { feedbackFormSchema } from '@src/utils/formSchemas';

const Form = () => {
  const [showForm, setShowForm] = useState<boolean>(true);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleRangeChange: FormEventHandler<HTMLInputElement> = (event) => {
    const inputValue = event.currentTarget.value;
    document.getElementById('num')!.textContent = inputValue;
  };

  const { register, handleSubmit } = useForm<
    z.infer<typeof feedbackFormSchema>
  >({
    resolver: zodResolver(feedbackFormSchema),
  });

  const api = useTRPC();
  const createForm = useMutation(api.form.sendForm.mutationOptions());

  const submitForm = handleSubmit((data) => {
    if (!createForm.isPending) createForm.mutate(data);
    handleShowForm();
  });

  return (
    <main className="relative">
      <form
        onSubmit={submitForm}
        className={`relative z-0 text-slate-700 ${
          showForm ? 'block' : 'hidden'
        }`}
      >
        <div className="absolute -top-3 left-0 hidden h-14 w-14 md:block">
          <Image
            src={nebulaPic}
            alt="Nebula Labs logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="pb-2 text-4xl font-bold">Feedback</h1>

        <h3 className="text-md border-t-2 border-black py-4 text-slate-500">
          On a scale of 1-10, how would you rate your experience with UTD Clubs?
        </h3>
        <input
          id="rating"
          type="range"
          min="1"
          max="10"
          onInput={handleRangeChange}
          {...register('rating', { valueAsNumber: true })}
          className="h-15 w-4/5 rounded-md border-2 bg-white text-left"
        />
        <output id="num" className="p-2 font-semibold">
          5
        </output>

        <br></br>

        <h3 className="text-md my-4 border-t-2 border-slate-200 pt-2 text-slate-500">
          What do you like about UTD Clubs?
        </h3>
        <textarea
          id="likes"
          rows={3}
          required
          {...register('likes')}
          className="h-15 w-4/5 resize-none overflow-auto rounded-md border-2 border-gray-500 p-1 text-left shadow-xl"
        ></textarea>
        <br></br>

        <h3 className="text-md my-4 w-full border-t-2 border-slate-200 pt-2 text-slate-500">
          What do you dislike about UTD Clubs?
        </h3>

        <textarea
          id="dislikes"
          rows={3}
          required
          {...register('dislikes')}
          className="w-4/5 resize-none rounded-md border-2 border-gray-500 p-1 text-left shadow-xl"
        ></textarea>

        <h3 className="text-md my-4 border-t-2 border-slate-200 pt-2 text-slate-500">
          What features would you like to see in UTD Clubs?
        </h3>

        <textarea
          id="features"
          rows={3}
          required
          {...register('features')}
          className="h-15 w-4/5 resize-none rounded-md border-2 border-gray-500 p-1 text-left shadow-xl"
        ></textarea>
        <br></br>
        <button
          type="submit"
          className="mx-auto my-5 rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <div className={`flex flex-col gap-4 ${showForm ? 'hidden' : 'block'}`}>
        The form has been submitted successfully!
        <Button
          component={Link}
          href="/"
          variant="contained"
          className="rounded-full normal-case"
        >
          Go Home
        </Button>
      </div>
    </main>
  );
};

export default Form;
