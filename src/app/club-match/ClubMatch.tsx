'use client';

import type { inferRouterInputs } from '@trpc/server';
import type { AppRouter } from '@src/server/api/root';
import { api } from '@src/trpc/react';
import { useState } from 'react';

type FormData = inferRouterInputs<AppRouter>['ai']['clubMatch'];

const TextInput = ({
  id,
  label,
  required,
  disabled,
  handleChange,
}: {
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}) => {
  return (
    <>
      {label && (
        <label htmlFor={id}>
          {label}
          {required ? <span className="text-red-600"> *</span> : null}
        </label>
      )}
      <input
        type="text"
        id={id}
        name={id}
        data-name={id}
        onChange={handleChange}
        required={required}
        disabled={disabled}
      />
    </>
  );
};

const SelectInput = ({
  id,
  label,
  options,
  required,
  handleChange,
}: {
  id: string;
  label: string;
  options: string[];
  required?: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}) => {
  return (
    <>
      <label htmlFor={id}>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      <select
        name={id}
        data-name={id}
        onChange={handleChange}
        required={required}
      >
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
  required,
  handleChange,
  other,
}: {
  type: 'checkbox' | 'radio';
  id: string;
  label: string;
  options: string[];
  required?: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  other?: {
    id: string;
    disabled: boolean;
  };
}) => {
  return (
    <fieldset>
      <legend>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </legend>
      {options.map((option) => (
        <div key={option}>
          <input
            type={type}
            id={id + option}
            name={id}
            data-name={id}
            value={option}
            onChange={handleChange}
          />
          <label htmlFor={id + option}>{option}</label>
          {typeof other !== 'undefined' && option === 'Other' && (
            <TextInput
              id={other.id}
              disabled={other.disabled}
              handleChange={handleChange}
            />
          )}
        </div>
      ))}
    </fieldset>
  );
};

const ClubMatch = () => {
  const [formData, setFormData] = useState<FormData>({
    major: 'unknown',
    year: 'unknown',
    proximity: 'unknown',
    categories: [],
    hobbies: [],
    gender: 'unknown',
    timeCommitment: 'unknown',
  });
  const [submitted, setSubmitted] = useState(false);

  const { data, error, isLoading, refetch } = api.ai.clubMatch.useQuery(
    formData,
    {
      enabled: false, // disables auto-fetching
    },
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const {
      dataset: { name },
      value,
      type,
    } = e.target;

    if (typeof name === 'undefined') {
      return;
    }

    setFormData((prev) => {
      if (type === 'checkbox') {
        const untypedPrevValues = prev[name as keyof FormData];
        const prevValues: string[] = Array.isArray(untypedPrevValues)
          ? untypedPrevValues
          : [];
        return {
          ...prev,
          [name]:
            'checked' in e.target && e.target.checked
              ? [...prevValues, value]
              : prevValues.filter((v: string) => v !== value),
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    void refetch();
  };

  ///TODO: form and response formatting
  ///TODO: better loading
  return (
    <>
      {!submitted && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-lg flex-col gap-4"
        >
          <TextInput
            id="major"
            label="What is your current or intended major?"
            required
            handleChange={handleChange}
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
            required
            handleChange={handleChange}
          />

          <SelectInput
            id="proximity"
            label="How close do you live to campus?"
            options={[
              'Live on campus in the residence halls',
              'Live near campus in an apartment or houses',
              'Live at home and commute',
            ]}
            required
            handleChange={handleChange}
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
            required
            handleChange={handleChange}
          />

          <TextInput
            id="specificCultures"
            label="If you selected cultural or religious organizations, please list the specific cultures or religions you are interested in."
            handleChange={handleChange}
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
            required
            handleChange={handleChange}
            other={{
              id: 'hobbiesOther',
              disabled: !formData.hobbies.includes('Other'),
            }}
          />

          <TextInput
            id="hobbyDetails"
            label="Please be specific about your selected hobbies."
            handleChange={handleChange}
          />

          <TextInput
            id="otherAcademicInterests"
            label="Beyond your major, are there other academic topics or tracks you're interested in?"
            handleChange={handleChange}
          />

          <CheckboxRadioInput
            type="radio"
            id="gender"
            label="Gender Identity"
            options={[
              'Woman',
              'Man',
              'Non-binary',
              'Prefer not to say',
              'Other',
            ]}
            required
            handleChange={handleChange}
            other={{
              id: 'genderOther',
              disabled: formData.gender !== 'Other',
            }}
          />

          <TextInput
            id="newExperiences"
            label="UT Dallas Experiences: What new experiences, hobbies, or activities would you be interested in while attending UT Dallas?"
            handleChange={handleChange}
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
            handleChange={handleChange}
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
            required
            handleChange={handleChange}
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
            handleChange={handleChange}
          />

          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-blue-300"
            disabled={
              formData.major === 'unknown' ||
              formData.year === 'unknown' ||
              formData.proximity === 'unknown' ||
              !formData.categories.length ||
              !formData.hobbies.length ||
              formData.gender === 'unknown' ||
              formData.timeCommitment === 'unknown'
            }
          >
            Find Clubs
          </button>
        </form>
      )}

      {isLoading && <p className="mt-4">Loading...</p>}

      {data && (
        <div className="mt-4 rounded border bg-gray-100 p-4">
          {data.map((club) => (
            <div key={club.id}>
              <p>{club.name}</p>
              <p>{club.id}</p>
              <p>{club.benefit}</p>
              <p>{club.reasoning}</p>
            </div>
          ))}
        </div>
      )}

      {submitted && error && (
        <div className="mt-4 rounded border bg-red-100 p-4 text-red-700">
          Error: {error.message}
        </div>
      )}
    </>
  );
};

export default ClubMatch;
