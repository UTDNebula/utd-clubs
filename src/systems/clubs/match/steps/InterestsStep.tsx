'use client';

import Typography from '@mui/material/Typography';
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
  'LGBTQ+',
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
        <Typography variant="h2" className="font-display text-2xl font-bold">
          Interests
        </Typography>
        <div className="flex flex-col gap-12">
          <form.AppField name="interests.categories">
            {(field) => (
              <field.Question
                question="What types of organizations are you interested in?"
                density="compact"
                required
              >
                <field.MultiSelect
                  className="w-full"
                  required
                  options={CATEGORY_OPTIONS}
                />
              </field.Question>
            )}
          </form.AppField>

          <form.Subscribe
            selector={(state) => state.values.interests?.categories}
          >
            {(categories) => {
              const showSpecificCultures =
                categories?.includes('Cultural') ||
                categories?.includes('Religious');

              return showSpecificCultures ? (
                <form.AppField name="interests.specificCultures">
                  {(field) => (
                    <field.Question
                      question="Please list the specific cultures or religions you are interested in."
                      density="compact"
                    >
                      <field.TextField className="w-full" />
                    </field.Question>
                  )}
                </form.AppField>
              ) : null;
            }}
          </form.Subscribe>

          <form.AppField name="interests.hobbies">
            {(field) => (
              <field.Question
                question="What are your hobbies or areas of interest?"
                density="compact"
                required
              >
                <field.MultiSelect
                  className="w-full"
                  required
                  options={HOBBY_OPTIONS}
                />
              </field.Question>
            )}
          </form.AppField>

          <form.AppField name="interests.hobbyDetails">
            {(field) => (
              <field.Question
                question="Please be specific about your selected hobbies."
                density="compact"
              >
                <field.TextField multiline minRows={2} className="w-full" />
              </field.Question>
            )}
          </form.AppField>

          <form.AppField name="interests.otherAcademicInterests">
            {(field) => (
              <field.Question
                question="Beyond your major, are there other academic topics or tracks you're interested in?"
                density="compact"
              >
                <field.TextField multiline minRows={2} className="w-full" />
              </field.Question>
            )}
          </form.AppField>

          <form.AppField name="interests.newExperiences">
            {(field) => (
              <field.Question
                question="What new experiences, hobbies, or activities would you be interested in?"
                density="compact"
              >
                <field.TextField multiline minRows={2} className="w-full" />
              </field.Question>
            )}
          </form.AppField>
        </div>
      </div>
    );
  },
});

export default InterestsStep;
