'use client';

import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z, ZodError } from 'zod';
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
  error: boolean;
  helperText?: string;
  field: AnyFieldApi;
}

const TextInput = ({
  id,
  label,
  disabled,
  error,
  helperText,
  field,
}: SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError = field.state.meta.isTouched && error;
  
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="min-h-[3rem] flex items-end">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <TextField
        id={id}
        variant="outlined"
        size="small"
        disabled={disabled}
        required={required}
        error={shouldShowError}
        helperText={shouldShowError ? helperText : undefined}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={shouldShowError}
      />
    </div>
  );
};


const SelectInput = ({
  id,
  label,
  options,
  error,
  helperText,
  field,
}: {
  options: string[];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError = field.state.meta.isTouched && error;
  
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="min-h-[3rem] flex items-end">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <FormControl error={shouldShowError} size="small" fullWidth>
        <Select
          id={id}
          required={required}
          value={field.state.value ?? ''}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
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
        {shouldShowError && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
};



const RadioInput = ({
  id,
  label,
  options,
  error,
  helperText,
  other,
  field,
  otherField,
}: {
  type?: 'radio';
  options: string[];
  other?: {
    id: keyof ClubMatchFormSchema;
    disabled: boolean;
  };
  otherField?: SharedInputProps['field'];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError = field.state.meta.isTouched && error;
  return (
    <fieldset className="flex flex-col gap-1">
      <label htmlFor={id} className="min-h-[3rem] flex items-end">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <FormControl error={shouldShowError}>
        <RadioGroup
          aria-invalid={shouldShowError}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
        >
          {options.map((option) => (
            <div key={option} className="flex items-center">
              <Radio
                id={`${id}-${option}`}
                value={option}
                onBlur={field.handleBlur}
                size="small"
                checked={field.state.value === option}
              />
              <label htmlFor={`${id}-${option}`} className="ml-1">
                {option}
              </label>
              {other && option === 'Other' && otherField && (
                <input
                  type="text"
                  id={other.id}
                  disabled={other.disabled}
                  value={otherField.state.value ?? ''}
                  onBlur={otherField.handleBlur}
                  onChange={(e) => otherField.handleChange(e.target.value)}
                  className="ml-2 rounded-md border border-gray-200 bg-white px-2 disabled:bg-gray-200"
                />
              )}
            </div>
          ))}
        </RadioGroup>
        {shouldShowError && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </fieldset>
  );
};


const SelectMultipleInput = ({
  id,
  label,
  options,
  error,
  helperText,
  field,
}: {
  id: keyof ClubMatchFormSchema;
  label: string;
  options: string[];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError = field.state.meta.isTouched && error;
  const value: string[] = field.state.value ?? [];
  return (
    <fieldset className="flex flex-col gap-1">
      <label htmlFor={id} className="min-h-[3rem] flex items-end">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <FormControl error={shouldShowError} variant="outlined" size="small">
        <Select
          labelId={`${id}-label`}
          id={id}
          multiple
          required={required}
          value={value}
          onBlur={field.handleBlur}
          onChange={(event) => {
            const value = event.target.value;
            field.handleChange(
              typeof value === 'string' ? value.split(',') : (value as string[]),
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
          MenuProps={{ PaperProps: { className: 'max-h-60' } }}
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
        {shouldShowError && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </fieldset>
  );
};


const ClubMatch = () => {
  const [errors, setErrors] = useState<Errors>({ errors: [] });

  const api = useTRPC();
  const router = useRouter();

  const editData = useMutation(
    api.ai.clubMatch.mutationOptions({
      onSuccess: () => {
        router.push('/club-match/results');
      },
      onError: (err) => {
        // err is typically TRPCClientError, not ZodError
        console.error(err);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      major: '',
      year: '',
      proximity: '',
      categories: [],
      hobbies: [],
      involvementGoals: [],
      skills: [],
      specificCultures: '',
      hobbyDetails: '',
      otherAcademicInterests: '',
      gender: '',
      genderOther: '',
      newExperiences: '',
      timeCommitment: '',
    } as ClubMatchFormSchema,
    validators: {
      onChange: clubMatchFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!editData.isPending) {
        await editData.mutateAsync(value);
      }
    },
  });

  return (
    <main className="p-4">
      <h1 className="font-display mb-2 text-center text-4xl font-bold text-haiti">
        Club Match
      </h1>
      <p className="mb-8 text-center">
        Generate club recommendations based on a simple form.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mx-auto flex w-full max-w-3xl flex-col gap-4"
      >
        <div className="bg-white p-8 shadow-xl rounded-4xl flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <form.Field name="major">
              {(field) => (
                <div className="flex-1">
                  <TextInput
                    id="major"
                    label="What is your current or intended major?"
                    error={!field.state.meta.isValid}
                    helperText={"Major is Required"}
                    disabled={false}
                    field={field}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="year">
              {(field) => (
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
                    error={!field.state.meta.isValid}
                    helperText={"Select your Year"}
                    field={field}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="proximity">
              {(field) => (
                <div className="flex-1">
                  <SelectInput
                    id="proximity"
                    label="How close do you live to campus?"
                    options={[
                      'Live on campus in the residence halls',
                      'Live near campus in an apartment or houses',
                      'Live at home and commute',
                    ]}
                    error={!field.state.meta.isValid}
                    helperText={"Choose a Proximity"}
                    field={field}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="categories">
            {(field) => (
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
                error={!field.state.meta.isValid}
                helperText={"Select an Organizaiton Type"}
                field={field}
              />
            )}
          </form.Field>

          {/* subscribe to the categories field so it only re-renders if categories changes */}
          <form.Subscribe selector={(state) => state.values.categories}>
            {(categories) => {
              const showSpecificCultures =
                categories?.includes('Cultural') ||
                categories?.includes('Religious');

              return showSpecificCultures ? (
                <form.Field name="specificCultures">
                  {(field) => (
                    <TextInput
                      id="specificCultures"
                      label="Please list the specific cultures or religions you are interested in."
                      error={!field.state.meta.isValid}
                      helperText={"Enter Cultures or Religions"}
                      disabled={false}
                      field={field}
                    />
                  )}
                </form.Field>
              ) : null;
            }}
          </form.Subscribe>

          <form.Field name="hobbies">
            {(field) => (
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
                  'Other',
                ]}
                error={!field.state.meta.isValid}
                helperText={"Select Hobbies/Interests"}
                field={field}
              />
            )}
          </form.Field>

          <form.Field name="hobbyDetails">
            {(field) => (
              <TextInput
                id="hobbyDetails"
                label="Please be specific about your selected hobbies."
                error={!field.state.meta.isValid}
                helperText={"Write about your Hobbies"}
                disabled={false}
                field={field}
              />
            )}
          </form.Field>

          <form.Field name="otherAcademicInterests">
            {(field) => (
              <TextInput
                id="otherAcademicInterests"
                label="Beyond your major, are there other academic topics or tracks you're interested in?"
                error={!field.state.meta.isValid}
                helperText={"Write about your other Academic Interests"}
                disabled={false}
                field={field}
              />
            )}
          </form.Field>

          <form.Field name="newExperiences">
            {(field) => (
              <TextInput
                id="newExperiences"
                label="What new experiences, hobbies, or activities would you be interested in?"
                error={!field.state.meta.isValid}
                helperText={"Enter new Experiences"}
                disabled={false}
                field={field}
              />
            )}
          </form.Field>

          <form.Field name="involvementGoals">
            {(field) => (
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
                error={!field.state.meta.isValid}
                helperText={"Write Goals"}
                field={field}
              />
            )}
          </form.Field>

          <form.Field name="skills">
            {(field) => (
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
                error={!field.state.meta.isValid}
                helperText={"Select Activities"}
                field={field}
              />
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Conditionally render on gender value */}
            <form.Subscribe selector={(state) => state.values.gender}>
              {(gender) => (
                <form.Field name="gender">
                  {(genderField) => (
                    <form.Field name="genderOther">
                      {(genderOtherField) => (
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
                          error={!genderField.state.meta.isValid}
                          helperText={"Select an option"}
                          field={genderField}
                          other={{
                            id: 'genderOther',
                            disabled: gender !== 'Other',
                          }}
                          otherField={genderOtherField}
                        />
                      )}
                    </form.Field>
                  )}
                </form.Field>
              )}
            </form.Subscribe>

            <form.Field name="timeCommitment">
              {(field) => (
                <RadioInput
                  id="timeCommitment"
                  label="Preferred Time Commitment"
                  options={[
                    'Low (e.g., < 2-3 hours/week, meetings optional)',
                    'Medium (e.g., 3-5 hours/week, regular meetings/events)',
                    'High (e.g., 5+ hours/week, significant responsibilities/practices)',
                    "Don't care",
                  ]}
                  error={!field.state.meta.isValid}
                  helperText={"Select preferred Time Commitment"}
                  field={field}
                />
              )}
            </form.Field>
          </div>
        </div>

        <Button
          variant="contained"
          type="submit"
          disabled={editData.isPending}
          className="normal-case"
        >
          {editData.isPending ? 'Finding Clubs...' : 'Find Clubs'}
        </Button>
      </form>
    </main>
  );
};

export default ClubMatch;
