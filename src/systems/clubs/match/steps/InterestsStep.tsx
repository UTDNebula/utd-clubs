'use client';

import { withForm } from '@/lib/utils/form';
import { ClubMatchWizardSchema } from '../clubMatchSchema';

const CATEGORY_OPTIONS = [
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
];

const HOBBY_OPTIONS = [
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
];

const InterestsStep = withForm({
  defaultValues: {} as ClubMatchWizardSchema,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <form.Question question="What types of organizations are you interested in?">
          <form.AppField name="interests.categories">
            {(field) => (
              <field.MultiSelect
                className="w-full"
                required
                options={CATEGORY_OPTIONS}
              />
            )}
          </form.AppField>
        </form.Question>

        <form.Subscribe
          selector={(state) => state.values.interests?.categories}
        >
          {(categories) => {
            const showSpecificCultures =
              categories?.includes('Cultural') ||
              categories?.includes('Religious');

            return showSpecificCultures ? (
              <form.Question
                question="Please list the specific cultures or religions you are interested in."
                density="compact"
              >
                <form.AppField name="interests.specificCultures">
                  {(field) => <field.TextField className="w-full" />}
                </form.AppField>
              </form.Question>
            ) : null;
          }}
        </form.Subscribe>

        <form.Question question="What are your hobbies or areas of interest?">
          <form.AppField name="interests.hobbies">
            {(field) => (
              <field.MultiSelect
                className="w-full"
                required
                options={HOBBY_OPTIONS}
              />
            )}
          </form.AppField>
        </form.Question>

        <form.Question question="Please be specific about your selected hobbies.">
          <form.AppField name="interests.hobbyDetails">
            {(field) => <field.TextField className="w-full" />}
          </form.AppField>
        </form.Question>

        <form.Question question="Beyond your major, are there other academic topics or tracks you're interested in?">
          <form.AppField name="interests.otherAcademicInterests">
            {(field) => <field.TextField className="w-full" />}
          </form.AppField>
        </form.Question>

        <form.Question question="What new experiences, hobbies, or activities would you be interested in?">
          <form.AppField name="interests.newExperiences">
            {(field) => <field.TextField className="w-full" />}
          </form.AppField>
        </form.Question>
      </div>
    );
  },
});

export default InterestsStep;
