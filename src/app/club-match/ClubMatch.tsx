'use client';

import {
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
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Panel from '@src/components/form/Panel';
import { Binoculars } from '@src/icons/OtherIcons';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { clubMatchFormSchema } from '@src/utils/formSchemas';

type ClubMatchFormSchema = z.infer<typeof clubMatchFormSchema>;

function isFieldRequired(fieldName: keyof ClubMatchFormSchema) {
  const shape = clubMatchFormSchema.shape;
  const field = shape[fieldName];
  return !field.safeParse(undefined).success;
}

interface SharedInputProps {
  id: keyof ClubMatchFormSchema;
  label?: string;
  disabled?: boolean;
  field: AnyFieldApi;
}

const TextInput = ({ id, label, disabled, field }: SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError =
    field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="whitespace-pre-line">
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
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        error={shouldShowError}
        helperText={
          shouldShowError
            ? field.state.meta.errors.map((err) => err?.message).join('. ') +
              '.'
            : undefined
        }
      />
    </div>
  );
};

const SelectInput = ({
  id,
  label,
  options,
  field,
}: {
  options: string[];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError =
    field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <FormControl className="flex flex-col gap-1">
      <label htmlFor={id} className="whitespace-pre-line">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <Select
        id={id}
        required={required}
        size="small"
        value={field.state.value ?? ''}
        onChange={(event) => field.handleChange(event.target.value)}
        error={shouldShowError}
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
      {shouldShowError && (
        <FormHelperText error>
          {field.state.meta.errors.map((err) => err?.message).join('. ') + '.'}
        </FormHelperText>
      )}
    </FormControl>
  );
};

const RadioInput = ({
  id,
  label,
  options,
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
  const shouldShowError =
    field.state.meta.isTouched && !field.state.meta.isValid;
  const otherFieldShouldShowError =
    otherField?.state.meta.isTouched && !otherField?.state.meta.isValid;
  return (
    <FormControl className="flex flex-col gap-1">
      <label htmlFor={id} className="whitespace-pre-line">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <RadioGroup
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
      >
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <Radio
              id={`${id}-${option}`}
              value={option}
              size="small"
              checked={field.state.value === option}
              onClick={() => {
                if (field.state.value === option) {
                  field.handleChange('');
                }
              }}
            />
            <label htmlFor={`${id}-${option}`} className="ml-1">
              {option}
            </label>
            {other && option === 'Other' && otherField && (
              <TextField
                id={other.id}
                variant="outlined"
                size="small"
                disabled={other.disabled}
                value={otherField.state.value ?? ''}
                onChange={(e) => otherField.handleChange(e.target.value)}
                error={otherFieldShouldShowError}
                helperText={
                  otherFieldShouldShowError
                    ? otherField.state.meta.errors
                        .map((err) => err?.message)
                        .join('. ') + '.'
                    : undefined
                }
                className="ml-2 [&>.Mui-disabled.MuiInputBase-root]:bg-gray-200"
              />
            )}
          </div>
        ))}
      </RadioGroup>
      {shouldShowError && (
        <FormHelperText error>
          {field.state.meta.errors.map((err) => err?.message) + '.'}
        </FormHelperText>
      )}
    </FormControl>
  );
};

const SelectMultipleInput = ({
  id,
  label,
  options,
  field,
}: {
  options: string[];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError =
    field.state.meta.isTouched && !field.state.meta.isValid;
  const value: string[] = field.state.value ?? [];
  return (
    <FormControl className="flex flex-col gap-1">
      <label htmlFor={id} className="whitespace-pre-line">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <Select
        labelId={`${id}-label`}
        id={id}
        multiple
        variant="outlined"
        size="small"
        required={required}
        value={value}
        onChange={(event) => {
          const value = event.target.value;
          field.handleChange(
            typeof value === 'string' ? value.split(',') : (value as string[]),
          );
        }}
        input={<OutlinedInput />}
        renderValue={(selected) => (
          <div className="flex flex-wrap gap-0.5">
            {(selected as string[]).map((value) => (
              <Chip key={value} label={value} color="primary" />
            ))}
          </div>
        )}
        MenuProps={{ PaperProps: { className: 'max-h-60' } }}
        error={shouldShowError}
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
      {shouldShowError && (
        <FormHelperText error>
          {field.state.meta.errors.map((err) => err?.message).join('. ') + '.'}
        </FormHelperText>
      )}
    </FormControl>
  );
};

const ClubMatch = () => {
  const api = useTRPC();
  const router = useRouter();

  const editData = useMutation(api.ai.clubMatch.mutationOptions({}));

  const form = useAppForm({
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
    onSubmit: async ({ value }) => {
      if (!editData.isPending) {
        await editData.mutateAsync(value);
        router.push('/club-match/results');
      }
    },
    validators: {
      onChange: clubMatchFormSchema,
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
      <form className="mx-auto w-full max-w-3xl">
        <Panel>
          <div className="m-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-start">
              <form.Field name="major">
                {(field) => (
                  <div className="flex-1">
                    <TextInput
                      id="major"
                      label="What is your current or intended major?"
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
                      label={'\nWhat year are you?'}
                      options={[
                        'A prospective student (not yet attending UTD)',
                        'A first-year student (non-transfer)',
                        'A first-year student (transfer)',
                        'A current student (2nd year+, non-transfer)',
                        'A current student (2nd year+, transfer)',
                      ]}
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
                  field={field}
                />
              )}
            </form.Field>

            <form.Field name="hobbyDetails">
              {(field) => (
                <TextInput
                  id="hobbyDetails"
                  label="Please be specific about your selected hobbies."
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
                    field={field}
                  />
                )}
              </form.Field>
            </div>
          </div>

          <div className="flex flex-wrap justify-end items-center gap-2">
            <form.AppForm>
              <form.FormResetButton />
            </form.AppForm>
            <form.AppForm>
              <div
                onClick={async () => {
                  form.handleSubmit(); // force submit so onSubmit validation shows errors
                }}
              >
                <form.FormSubmitButton text="Find Clubs" icon={Binoculars} />
              </div>
            </form.AppForm>
          </div>
        </Panel>
      </form>
    </main>
  );
};

export default ClubMatch;
