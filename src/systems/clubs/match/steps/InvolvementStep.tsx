'use client';

import Typography from '@mui/material/Typography';
import { withForm } from '@/lib/utils/form';
import { ClubMatchWizardSchema } from '../clubMatchSchema';

const INVOLVEMENT_GOAL_OPTIONS = [
  'Make Friends/Build Community',
  'Develop Leadership Skills',
  'Gain Experience for Resume/Career',
  'Explore a Specific Interest/Hobby',
  'Networking (Peers/Professionals)',
  'Make an Impact/Serve Others',
  'Learn New Skills',
  'Find Mentorship',
  'Simply Have Fun/De-stress',
];

const SKILL_OPTIONS = [
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
];

const GENDER_OPTIONS = [
  'Female',
  'Male',
  'Non-binary',
  'Prefer not to say',
  'Other',
];

const TIME_COMMITMENT_OPTIONS = [
  'Low (e.g., < 2-3 hours/week, meetings optional)',
  'Medium (e.g., 3-5 hours/week, regular meetings/events)',
  'High (e.g., 5+ hours/week, significant responsibilities/practices)',
  "Don't care",
];

const InvolvementStep = withForm({
  defaultValues: {} as ClubMatchWizardSchema,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <Typography variant="h2" className="font-display text-2xl font-bold">
          Involvement
        </Typography>
        <div className="flex flex-col gap-12">
          <form.Question
            question="Goals for Getting Involved"
            density="compact"
          >
            <form.AppField name="involvement.involvementGoals">
              {(field) => (
                <field.MultiSelect
                  className="w-full"
                  options={INVOLVEMENT_GOAL_OPTIONS}
                />
              )}
            </form.AppField>
          </form.Question>

          <form.Question
            question="Skills & Activities Interest"
            density="compact"
          >
            <form.AppField name="involvement.skills">
              {(field) => (
                <field.MultiSelect className="w-full" options={SKILL_OPTIONS} />
              )}
            </form.AppField>
          </form.Question>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <form.Question question="Gender Identity" density="compact">
              <form.AppField name="involvement.gender">
                {(field) => (
                  <field.RadioGroup
                    className="w-full"
                    options={GENDER_OPTIONS}
                  />
                )}
              </form.AppField>
              <form.Subscribe
                selector={(state) => state.values.involvement?.gender}
              >
                {(gender) =>
                  gender === 'Other' ? (
                    <form.AppField name="involvement.genderOther">
                      {(field) => (
                        <field.TextField
                          placeholder="Please specify"
                          className="w-full"
                        />
                      )}
                    </form.AppField>
                  ) : null
                }
              </form.Subscribe>
            </form.Question>

            <form.Question
              question="Preferred Time Commitment"
              density="compact"
            >
              <form.AppField name="involvement.timeCommitment">
                {(field) => (
                  <field.RadioGroup
                    className="w-full"
                    required
                    options={TIME_COMMITMENT_OPTIONS}
                  />
                )}
              </form.AppField>
            </form.Question>
          </div>
        </div>
      </div>
    );
  },
});

export default InvolvementStep;
