'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormRegister } from 'react-hook-form';
import { z, type ZodError } from 'zod';
import { useTRPC } from '@src/trpc/react';
import { clubMatchFormSchema } from '@src/utils/formSchemas';

type ClubMatchFormSchema = z.infer<typeof clubMatchFormSchema>;

type Errors = {
  errors: string[];
  properties?: Record<keyof ClubMatchFormSchema, { errors: string[] }>;
};

function isFieldRequired(fieldName: keyof ClubMatchFormSchema) {
  const shape = clubMatchFormSchema.shape;
  const field = shape[fieldName];
  return !field.safeParse(undefined).success;
}

interface SharedInputProps {
  id: keyof ClubMatchFormSchema;
  label?: string;
  disabled?: boolean;
  register: UseFormRegister<ClubMatchFormSchema>;
  errors: Errors;
}

const TextInput = ({
  id,
  label,
  disabled,
  register,
  errors,
}: {
  disabled?: boolean;
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      {errors.properties?.[id]?.errors &&
        errors.properties?.[id].errors.map((error) => (
          <span key={error} role="alert" className="text-red-600">
            {error}
          </span>
        ))}
      <input
        type="text"
        id={id}
        disabled={disabled}
        required={required}
        {...register(id)}
        aria-invalid={!!errors.properties?.[id]}
        className="rounded-md border border-gray-200 bg-white px-4 py-2 disabled:bg-gray-200"
      />
    </div>
  );
};

const SelectInput = ({
  id,
  label,
  options,
  register,
  errors,
}: {
  options: string[];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {errors.properties?.[id]?.errors &&
        errors.properties?.[id].errors.map((error) => (
          <span key={error} role="alert" className="text-red-600">
            {error}
          </span>
        ))}
      <select
        required={required}
        {...register(id)}
        className="rounded-md border border-gray-200 bg-white px-4 py-2 disabled:bg-gray-200"
      >
        <option value="">--Select--</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const CheckboxRadioInput = ({
  type = 'checkbox',
  id,
  label,
  options,
  register,
  errors,
  other,
}: {
  type: 'checkbox' | 'radio';
  options: string[];
  other?: {
    id: keyof ClubMatchFormSchema;
    disabled: boolean;
  };
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  return (
    <fieldset className="flex flex-col gap-1">
      <legend>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </legend>
      {errors.properties?.[id]?.errors &&
        errors.properties?.[id].errors.map((error) => (
          <span key={error} role="alert" className="text-red-600">
            {error}
          </span>
        ))}
      <div>
        {options.map((option) => (
          <div key={option}>
            <input
              type={type}
              id={id + option}
              value={option}
              {...register(id)}
            />
            <label htmlFor={id + option} className="ml-1">
              {option}
            </label>
            {typeof other !== 'undefined' && option === 'Other' && (
              <input
                type="text"
                id={other.id}
                disabled={other.disabled}
                {...register(other.id)}
                aria-invalid={!!errors.properties?.[other.id]}
                className="ml-2 rounded-md border border-gray-200 bg-white px-2 disabled:bg-gray-200"
              />
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

const ClubMatch = () => {
  const { register, watch, handleSubmit } = useForm<ClubMatchFormSchema>({
    resolver: zodResolver(clubMatchFormSchema),
    defaultValues: {
      categories: [],
      hobbies: [],
      involvementGoals: [],
      skills: [],
    },
  });
  const [errors, setErrors] = useState<Errors>({ errors: [] });

  const api = useTRPC();
  const router = useRouter();
  const editData = useMutation(
    api.ai.clubMatch.mutationOptions({
      onSuccess: () => {
        router.push('/club-match/results');
      },
    }),
  );
  const submitForm = handleSubmit((data) => {
    if (!editData.isPending) {
      editData.mutate(data);
    }
  });

  const hobbies = watch('hobbies');
  const hobbiesOtherDisabled = hobbies ? !hobbies.includes('Other') : true;
  const genderOtherDisabled = watch('gender') !== 'Other';

  return (
    <main className="pb-8">
      <h1 className="mb-2 text-center text-4xl font-bold">Club Match</h1>
      <p className="mb-8 text-center">
        Find your club match! Generate club recommendations based on a simple
        form.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm().catch((err: ZodError) => {
            setErrors(z.treeifyError(err));
          });
        }}
        className="mx-auto flex max-w-lg flex-col gap-4"
      >
        <TextInput
          id="major"
          label="What is your current or intended major?"
          register={register}
          errors={errors}
        />

        <SelectInput
          id="year"
          label="What year are you?"
          options={[
            'A prospective student (not yet attending UTD)',
            'A first-year student (non-transfer)',
            'A first-year student (transfer)',
            'A current student (2nd year+, non-transfer)',
            'A current student (2nd year+, transfer)',
          ]}
          register={register}
          errors={errors}
        />

        <SelectInput
          id="proximity"
          label="How close do you live to campus?"
          options={[
            'Live on campus in the residence halls',
            'Live near campus in an apartment or houses',
            'Live at home and commute',
          ]}
          register={register}
          errors={errors}
        />

        <CheckboxRadioInput
          type="checkbox"
          id="categories"
          label="What types of organizations are you interested in?"
          options={[
            'Academic',
            'Art and Music',
            'Club Sports',
            'Cultural',
            'Educational/Departmental',
            'Fraternity & Sorority Life',
            'Honor Society',
            'Political',
            'Recreation',
            'Religious',
            'Service',
            'Social',
            'Special Interest',
            'Student Government',
            'Student Media',
          ]}
          register={register}
          errors={errors}
        />

        <TextInput
          id="specificCultures"
          label="If you selected cultural or religious organizations, please list the specific cultures or religions you are interested in."
          register={register}
          errors={errors}
        />

        <CheckboxRadioInput
          type="checkbox"
          id="hobbies"
          label="What are your hobbies or areas of interest?"
          options={[
            'Gaming/Esports',
            'Outdoor Activities/Sports',
            'Reading/Writing',
            'Cooking/Food',
            'Technology/Maker',
            'Film/TV/Pop Culture',
            'Board Games/Tabletop RPGs',
            'Volunteering',
            'Fitness/Wellness',
            'Performing Arts',
            'Visual Arts',
            'Other',
          ]}
          register={register}
          errors={errors}
          other={{
            id: 'hobbiesOther',
            disabled: hobbiesOtherDisabled,
          }}
        />

        <TextInput
          id="hobbyDetails"
          label="Please be specific about your selected hobbies."
          register={register}
          errors={errors}
        />

        <TextInput
          id="otherAcademicInterests"
          label="Beyond your major, are there other academic topics or tracks you're interested in?"
          register={register}
          errors={errors}
        />

        <CheckboxRadioInput
          type="radio"
          id="gender"
          label="Gender Identity"
          options={['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Other']}
          register={register}
          errors={errors}
          other={{
            id: 'genderOther',
            disabled: genderOtherDisabled,
          }}
        />

        <TextInput
          id="newExperiences"
          label="UT Dallas Experiences: What new experiences, hobbies, or activities would you be interested in while attending UT Dallas?"
          register={register}
          errors={errors}
        />

        <CheckboxRadioInput
          type="checkbox"
          id="involvementGoals"
          label="Goals for Getting Involved"
          options={[
            'Make Friends/Build Community',
            'Develop Leadership Skills',
            'Gain Experience for Resume/Career',
            'Explore a Specific Interest/Hobby',
            'Networking (Peers/Professionals)',
            'Make an Impact/Serve Others',
            'Learn New Skills',
            'Find Mentorship',
            'Simply Have Fun/De-stress',
          ]}
          register={register}
          errors={errors}
        />

        <CheckboxRadioInput
          type="radio"
          id="timeCommitment"
          label="Preferred Time Commitment"
          options={[
            'Low (e.g., < 2-3 hours/week, meetings optional)',
            'Medium (e.g., 3-5 hours/week, regular meetings/events)',
            'High (e.g., 5+ hours/week, significant responsibilities/practices)',
            "Don't care",
          ]}
          register={register}
          errors={errors}
        />

        <CheckboxRadioInput
          type="checkbox"
          id="skills"
          label="Skills & Activities Interest"
          options={[
            'Advocacy/Campaigning',
            'Building/Making Things',
            'Event Planning',
            'Graphic Design/Visual Arts',
            'Fundraising',
            'Performing (Music, Acting, Dance)',
            'Public Speaking/Presenting',
            'Social Media Management',
            'Tutoring/Mentoring',
            'Website/App Development',
            'Writing/Editing',
          ]}
          register={register}
          errors={errors}
        />

        <button
          type="submit"
          className="bg-blue-primary rounded-md px-4 py-2 text-white disabled:bg-blue-300"
          disabled={editData.isPending}
        >
          {editData.isPending ? 'Loading' : 'Find Clubs'}
        </button>
      </form>
    </main>
  );
};

export default ClubMatch;
