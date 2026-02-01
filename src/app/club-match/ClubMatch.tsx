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
} from '@mui/material';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Panel from '@src/components/common/Panel';
import { Binoculars } from '@src/icons/OtherIcons';
import { SelectUserMetadata } from '@src/server/db/models';
import { ClubMatchResponses } from '@src/server/db/schema/users';
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

const RadioInput = ({
  id,
  label,
  options,
  field,
}: {
  type?: 'radio';
  options: string[];
} & SharedInputProps) => {
  const required = isFieldRequired(id);
  const shouldShowError =
    field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <FormControl className="flex flex-col gap-1">
      <label htmlFor={id} className="whitespace-pre-line">
        {label}
        {required && <span className="text-red-600 dark:text-red-400"> *</span>}
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
        {required && <span className="text-red-600 dark:text-red-400"> *</span>}
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

type ClubMatchProps = {
  response: ClubMatchResponses | null;
  userMetadata: SelectUserMetadata | null;
};

const ClubMatch = ({ response, userMetadata }: ClubMatchProps) => {
  const api = useTRPC();
  const router = useRouter();

  const editData = useMutation(api.ai.clubMatch.mutationOptions({}));

  const form = useAppForm({
    defaultValues: {
      major: userMetadata?.major ?? response?.major ?? '',
      year: response?.year ?? '',
      proximity: response?.proximity ?? '',
      categories: response?.categories ?? [],
      hobbies: response?.hobbies ?? [],
      involvementGoals: response?.involvementGoals ?? [],
      skills: response?.skills ?? [],
      specificCultures: response?.specificCultures ?? '',
      hobbyDetails: response?.hobbyDetails ?? '',
      otherAcademicInterests: response?.otherAcademicInterests ?? '',
      gender: response?.gender ?? '',
      genderOther: response?.genderOther ?? '',
      newExperiences: response?.newExperiences ?? '',
      timeCommitment: response?.timeCommitment ?? '',
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
    <main className="p-4 mb-10">
      <h1 className="font-display mb-2 text-center text-4xl font-bold">
        Club Match
      </h1>
      <p className="mb-8 text-center">
        Generate club recommendations based on a simple form.
      </p>
      <form className="mx-auto w-full max-w-3xl">
        <Panel>
          <div className="m-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-start">
              <form.Question question="What is your current or intended major?">
                <form.AppField name="major">
                  {(field) => (
                    <field.TextField
                      className="w-full"
                      required={isFieldRequired('major')}
                    />
                  )}
                </form.AppField>
              </form.Question>
              <form.AppField name="year">
                {(field) => (
                  <field.Select
                    label="What year are you?"
                    className="w-full"
                    required={isFieldRequired('year')}
                    options={[
                      'A prospective student (not yet attending UTD)',
                      'A first-year student (non-transfer)',
                      'A first-year student (transfer)',
                      'A current student (2nd year+, non-transfer)',
                      'A current student (2nd year+, transfer)',
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="proximity">
                {(field) => (
                  <field.Select
                    label="How close do you live to campus?"
                    className="w-full"
                    required={isFieldRequired('proximity')}
                    options={[
                      'Live on campus in the residence halls',
                      'Live near campus in an apartment or houses',
                      'Live at home and commute',
                    ]}
                  />
                )}
              </form.AppField>
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
                  <form.AppField name="specificCultures">
                    {(field) => (
                      <field.TextField
                        label="Please list the specific cultures or religions you are interested in."
                        className="w-full"
                        required={isFieldRequired('specificCultures')}
                      />
                    )}
                  </form.AppField>
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

            <form.AppField name="hobbyDetails">
              {(field) => (
                <field.TextField
                  label="Please be specific about your selected hobbies."
                  className="w-full"
                  required={isFieldRequired('hobbyDetails')}
                />
              )}
            </form.AppField>

            <form.AppField name="otherAcademicInterests">
              {(field) => (
                <field.TextField
                  label="Beyond your major, are there other academic topics or tracks you're interested in?"
                  className="w-full"
                  required={isFieldRequired('otherAcademicInterests')}
                />
              )}
            </form.AppField>

            <form.AppField name="newExperiences">
              {(field) => (
                <field.TextField
                  label="What new experiences, hobbies, or activities would you be interested in?"
                  className="w-full"
                  required={isFieldRequired('newExperiences')}
                />
              )}
            </form.AppField>

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
                  <>
                    <form.Field name="gender">
                      {(genderField) => (
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
                        />
                      )}
                    </form.Field>
                    {gender === 'Other' && (
                      <form.AppField name="genderOther">
                        {(field) => (
                          <field.TextField
                            label="Please specify"
                            className="w-full"
                            required={isFieldRequired('genderOther')}
                          />
                        )}
                      </form.AppField>
                    )}
                  </>
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
              <form.ResetButton />
            </form.AppForm>
            <form.AppForm>
              <form.SubmitButton
                text="Find Clubs"
                icon={<Binoculars />}
                onClick={async () => {
                  form.handleSubmit(); // force submit so onSubmit validation shows errors
                }}
                allowDisable={false}
              />
            </form.AppForm>
          </div>
        </Panel>
      </form>
    </main>
  );
};

export default ClubMatch;
