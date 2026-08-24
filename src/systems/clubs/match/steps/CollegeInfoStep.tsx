'use client';

import Typography from '@mui/material/Typography';
import { withForm } from '@/lib/utils/form';
import { majors } from '@/lib/utils/utdDegrees';
import { ClubMatchWizardSchema } from '../clubMatchSchema';

const YEAR_OPTIONS = [
  'A prospective student (not yet attending UTD)',
  'A first-year student (non-transfer)',
  'A first-year student (transfer)',
  'A current student (2nd year+, non-transfer)',
  'A current student (2nd year+, transfer)',
];

const PROXIMITY_OPTIONS = [
  'Live on campus in the residence halls',
  'Live near campus in an apartment or houses',
  'Live at home and commute',
];

const CollegeInfoStep = withForm({
  defaultValues: {} as ClubMatchWizardSchema,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <Typography variant="h2" className="font-display text-2xl font-bold">
          College Info
        </Typography>
        <div className="flex flex-col gap-12">
          <form.Question
            question="What is your current or intended major?"
            density="compact"
          >
            <form.AppField name="collegeInfo.major">
              {(field) => (
                <field.AutocompleteFreeSolo
                  placeholder="Select or enter your major"
                  options={majors}
                  className="w-full max-w-md"
                  required
                />
              )}
            </form.AppField>
          </form.Question>

          <form.Question question="What year are you?" density="compact">
            <form.AppField name="collegeInfo.year">
              {(field) => (
                <field.Select
                  className="w-full max-w-md"
                  required
                  options={YEAR_OPTIONS}
                />
              )}
            </form.AppField>
          </form.Question>

          <form.Question
            question="How close do you live to campus?"
            density="compact"
          >
            <form.AppField name="collegeInfo.proximity">
              {(field) => (
                <field.Select
                  className="w-full max-w-md"
                  required
                  options={PROXIMITY_OPTIONS}
                />
              )}
            </form.AppField>
          </form.Question>
        </div>
      </div>
    );
  },
});

export default CollegeInfoStep;
