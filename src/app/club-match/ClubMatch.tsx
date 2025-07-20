'use client';

import { clubMatchFormSchema } from '@src/utils/formSchemas';
import { api } from '@src/trpc/react';
import { type z } from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';

type ClubMatchFormSchema = z.infer<typeof clubMatchFormSchema>;

function isFieldRequired(fieldName: keyof ClubMatchFormSchema) {
  const shape = clubMatchFormSchema.shape;
  const field = shape[fieldName];
  return !field.isOptional();
}

interface SharedInputProps {
  id: keyof ClubMatchFormSchema;
  label?: string;
  disabled?: boolean;
  register: UseFormRegister<ClubMatchFormSchema>;
  errors: FieldErrors<ClubMatchFormSchema>;
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
    <>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <input
        type="text"
        id={id}
        disabled={disabled}
        required={required}
        {...register(id)}
        aria-invalid={!!errors[id]}
      />
    </>
  );
};

const SelectInput = ({
  id,
  label,
  options,
  register,
}: {
  options: string[];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  return (
    <>
      <label htmlFor={id}>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <select required={required} {...register(id)}>
        <option value="">--Select--</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
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
    <fieldset>
      <legend>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </legend>
      {options.map((option) => (
        <div key={option}>
          <input
            type={type}
            id={id + option}
            value={option}
            required={required}
            {...register(id)}
          />
          <label htmlFor={id + option}>{option}</label>
          {typeof other !== 'undefined' && option === 'Other' && (
            <TextInput
              id={other.id}
              disabled={other.disabled}
              register={register}
              errors={errors}
            />
          )}
        </div>
      ))}
    </fieldset>
  );
};

const ClubMatch = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ClubMatchFormSchema>({
    resolver: zodResolver(clubMatchFormSchema),
  });

  const router = useRouter();
  const editData = api.ai.clubMatch.useMutation({
    onSuccess: () => {
      router.push('/club-match/results');
    },
  });
  const submitForm = handleSubmit((data) => {
    if (!editData.isPending) {
      editData.mutate(data);
    }
  });

  const hobbiesOtherDisabled = !watch('hobbies')?.includes('Other');
  const genderOtherDisabled = watch('gender') !== 'Other';

  return (
    <form
      onSubmit={void submitForm}
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
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-blue-300"
        disabled={editData.isPending}
      >
        {editData.isPending ? 'Loading' : 'Find Clubs'}
      </button>
    </form>
  );
};

export default ClubMatch;
