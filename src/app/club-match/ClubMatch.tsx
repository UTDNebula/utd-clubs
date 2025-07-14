'use client';

import type { inferRouterInputs } from '@trpc/server';
import type { AppRouter } from '@src/server/api/root';
import { api } from '@src/trpc/react';
import { useState } from 'react';

type FormData = inferRouterInputs<AppRouter>['ai']['clubMatch'];

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
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (type === 'checkbox') {
        const untypedPrevValues = prev[name as keyof FormData];
        const prevValues: string[] = Array.isArray(untypedPrevValues) ? untypedPrevValues : [];
        return {
          ...prev,
          [name]: 'checked' in e.target && e.target.checked
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
          <label>
            What is your current or intended major? *
            <input type="text" name="major" onChange={handleChange} required />
          </label>

          <label>
            What year are you? *
            <select name="year" onChange={handleChange} required>
              <option value="">--Select--</option>
              <option value="A prospective student (not yet attending UTD)">
                A prospective student (not yet attending UTD)
              </option>
              <option value="A first-year student (non-transfer">
                A first-year student (non-transfer)
              </option>
              <option value="A first-year student (transfer)">
                A first-year student (transfer)
              </option>
              <option value="A current student (2nd year+, non-transfer)">
                A current student (2nd year+, non-transfer)
              </option>
              <option value="A current student (2nd year+, transfer)">
                A current student (2nd year+, transfer)
              </option>
            </select>
          </label>

          <label>
            How close do you live to campus? *
            <select name="proximity" onChange={handleChange} required>
              <option value="">--Select--</option>
              <option value="Live on campus in the residence halls">
                Live on campus in the residence halls
              </option>
              <option value="Live near campus in an apartment or houses">
                Live near campus in an apartment or house
              </option>
              <option value="Live at home and commute">
                Live at home and commute
              </option>
            </select>
          </label>

          <fieldset>
            <legend>
              What types of organizations are you interested in? *
            </legend>
            {[
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
            ].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  name="categories"
                  value={type}
                  onChange={handleChange}
                />
                {type}
              </label>
            ))}
          </fieldset>

          <label>
            If you selected cultural or religious organizations, please list the
            specific cultures or religions you are interested in.
            <input
              type="text"
              name="specificCultures"
              onChange={handleChange}
            />
          </label>

          <fieldset>
            <legend>What are your hobbies or areas of interest? *</legend>
            {[
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
            ].map((hobby) => (
              <label key={hobby}>
                <input
                  type="checkbox"
                  name="hobbies"
                  value={hobby}
                  onChange={handleChange}
                />
                {hobby}
                {hobby === 'Other' && (
                  <input
                    type="text"
                    name="hobbiesOther"
                    onChange={handleChange}
                    disabled={
                      typeof formData.hobbies === 'undefined' ||
                      !formData.hobbies.includes('Other')
                    }
                  />
                )}
              </label>
            ))}
          </fieldset>

          <label>
            Please be specific about your selected hobbies.
            <textarea name="hobbyDetails" onChange={handleChange} />
          </label>

          <label>
            Beyond your major, are there other academic topics or tracks
            you&apos;re interested in?
            <textarea name="otherAcademicInterests" onChange={handleChange} />
          </label>

          <fieldset>
            <legend>Gender Identity *</legend>
            {['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Other'].map(
              (gender) => (
                <label key={gender}>
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    onChange={handleChange}
                    required
                  />
                  {gender}
                  {gender === 'Other' && (
                    <input
                      type="text"
                      name="genderOther"
                      onChange={handleChange}
                      disabled={formData.gender !== 'Other'}
                    />
                  )}
                </label>
              ),
            )}
          </fieldset>

          <label>
            UT Dallas Experiences: What new experiences, hobbies, or activities
            would you be interested in while attending UT Dallas?
            <textarea name="newExperiences" onChange={handleChange} />
          </label>

          <fieldset>
            <legend>Goals for Getting Involved</legend>
            {[
              'Make Friends/Build Community',
              'Develop Leadership Skills',
              'Gain Experience for Resume/Career',
              'Explore a Specific Interest/Hobby',
              'Networking (Peers/Professionals)',
              'Make an Impact/Serve Others',
              'Learn New Skills',
              'Find Mentorship',
              'Simply Have Fun/De-stress',
            ].map((goal) => (
              <label key={goal}>
                <input
                  type="checkbox"
                  name="involvementGoals"
                  value={goal}
                  onChange={handleChange}
                />
                {goal}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Preferred Time Commitment *</legend>
            {[
              'Low (e.g., < 2-3 hours/week, meetings optional)',
              'Medium (e.g., 3-5 hours/week, regular meetings/events)',
              'High (e.g., 5+ hours/week, significant responsibilities/practices)',
              "Don't care",
            ].map((level) => (
              <label key={level}>
                <input
                  type="radio"
                  name="timeCommitment"
                  value={level}
                  onChange={handleChange}
                  required
                />
                {level}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Skills & Activities Interest</legend>
            {[
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
            ].map((skill) => (
              <label key={skill}>
                <input
                  type="checkbox"
                  name="skills"
                  value={skill}
                  onChange={handleChange}
                />
                {skill}
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Find Clubs
          </button>
        </form>
      )}

      {isLoading && <p className="mt-4">Loading...</p>}

      {data && (
        <div className="mt-4 rounded border bg-gray-100 p-4">
          <p>{data}</p>
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
