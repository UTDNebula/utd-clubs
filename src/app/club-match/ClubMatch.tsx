'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Controller,
  useForm,
  type Control,
  type UseFormRegister,
} from 'react-hook-form';
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
        <div className="min-h-[3rem] flex items-end">
          <label htmlFor={id}>
            {label}
            {required && <span className="text-red-600"> *</span>}
          </label>
        </div>
      )}
      {errors.properties?.[id]?.errors &&
        errors.properties?.[id].errors.map((error) => (
          <span key={error} role="alert" className="text-red-600">
            {error}
          </span>
        ))}
      <TextField
        id={id}
        variant="outlined"
        size="small"
        disabled={disabled}
        required={required}
        {...register(id)}
        aria-invalid={!!errors.properties?.[id]}
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
      <div className="min-h-[3rem] flex items-end">
        <label htmlFor={id}>
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      </div>
      {errors.properties?.[id]?.errors &&
        errors.properties?.[id].errors.map((error) => (
          <span key={error} role="alert" className="text-red-600">
            {error}
          </span>
        ))}
      <Select
        id={id}
        required={required}
        size="small"
        defaultValue=""
        {...register(id)}
      >
        <MenuItem disabled value="">
          <em>--Select--</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

const RadioInput = ({
  id,
  label,
  options,
  register,
  errors,
  other,
}: {
  type?: 'radio';
  options: string[];
  other?: {
    id: keyof ClubMatchFormSchema;
    disabled: boolean;
  };
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  return (
    <fieldset className="flex flex-col gap-1">
      <div className="min-h-[3rem] flex items-end">
        <label htmlFor={id}>
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      </div>
      {errors.properties?.[id]?.errors &&
        errors.properties?.[id].errors.map((error) => (
          <span key={error} role="alert" className="text-red-600">
            {error}
          </span>
        ))}
      <RadioGroup aria-invalid={!!errors.properties?.[id]}>
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <Radio
              id={`${id}-${option}`}
              value={option}
              {...register(id)}
              size="small"
            />
            <label htmlFor={`${id}-${option}`} className="ml-1">
              {option}
            </label>
            {other && option === 'Other' && (
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
      </RadioGroup>
    </fieldset>
  );
};

const SelectMultipleInput = ({
  id,
  label,
  options,
  control,
  errors,
}: {
  id: keyof ClubMatchFormSchema;
  label: string;
  options: string[];
  control: Control<ClubMatchFormSchema>;
  errors: Errors;
}) => {
  const required = isFieldRequired(id);
  return (
    <fieldset className="flex flex-col gap-1">
      <div className="min-h-[3rem] flex items-end">
        <label htmlFor={id}>
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      </div>
      {errors.properties?.[id]?.errors &&
        errors.properties?.[id].errors.map((error) => (
          <span key={error} role="alert" className="text-red-600">
            {error}
          </span>
        ))}
      <Controller
        name={id}
        control={control}
        defaultValue={[] as string[]}
        render={({ field }) => (
          <Select
            labelId={`${id}-label`}
            id={id}
            multiple
            variant="outlined"
            size="small"
            required={required}
            value={field.value}
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(
                typeof value === 'string' ? value.split(',') : value,
              );
            }}
            input={<OutlinedInput />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} color="primary" />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            <MenuItem disabled value="">
              <em>--Select one or multiple--</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </fieldset>
  );
};

const ClubMatch = () => {
  const { register, watch, handleSubmit, control } =
    useForm<ClubMatchFormSchema>({
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

  const categories = watch('categories') || [];
  const showSpecificCultures =
    categories.includes('Cultural') || categories.includes('Religious');
  const hobbies = watch('hobbies');
  const hobbiesOtherDisabled = hobbies ? !hobbies.includes('Other') : true;
  const genderOtherDisabled = watch('gender') !== 'Other';

  return (
    <main className="pb-8">
      <h1 className="mb-2 text-center text-4xl font-bold text-haiti">
        Club Match
      </h1>
      <p className="mb-8 text-center">
        Generate club recommendations based on a simple form.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm().catch((err: ZodError) => {
            setErrors(z.treeifyError(err));
          });
        }}
        className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4"
      >
        <div className="bg-white p-8 shadow-xl rounded-4xl flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex-1">
              <TextInput
                id="major"
                label="What is your current or intended major?"
                register={register}
                errors={errors}
              />
            </div>
            <div className="flex-1">
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
            </div>
            <div className="flex-1">
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
            </div>
          </div>
          <SelectMultipleInput
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
            control={control}
            errors={errors}
          />
          {showSpecificCultures && (
            <TextInput
              id="specificCultures"
              label="Please list the specific cultures or religions you are interested in."
              register={register}
              errors={errors}
            />
          )}
          <SelectMultipleInput
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
            ]}
            control={control}
            errors={errors}
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

          <TextInput
            id="newExperiences"
            label="What new experiences, hobbies, or activities would you be interested in?"
            register={register}
            errors={errors}
          />

          <SelectMultipleInput
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
            control={control}
            errors={errors}
          />

          <SelectMultipleInput
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
            control={control}
            errors={errors}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RadioInput
              id="gender"
              label="Gender Identity"
              options={[
                'Female',
                'Male',
                'Non-binary',
                'Prefer not to say',
                'Other',
              ]}
              register={register}
              errors={errors}
              other={{
                id: 'genderOther',
                disabled: genderOtherDisabled,
              }}
            />

            <RadioInput
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
          </div>
        </div>
        <Button
          variant="contained"
          type="submit"
          loading={editData.isPending}
          loadingPosition="start"
          className="normal-case"
        >
          Find Clubs
        </Button>
      </form>
    </main>
  );
};

export default ClubMatch;
