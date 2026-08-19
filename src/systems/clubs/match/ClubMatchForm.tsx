'use client';

import { useAppForm } from "@/lib/utils/form";
import { clubMatchFormSchema } from "./clubMatchSchema";

export const ClubMatchForm = () => {
  const form = useAppForm({
    validators: {
      onChange: clubMatchFormSchema,
    }
  })
  return (
    <form.AppForm>
      <form.Wizard>
        <form.WizardStep
          name="college-info"
          label="College Info"
        >
          <form.Question
            question="What is your current or intended major?"
            className="w-full items-center text-center"
          >
            <div className="flex w-full flex-row flex-wrap justify-center gap-4">
              <form.AppField name="name.name">
                {(field) => (
                  <field.TextField
                    label="Major"
                    className="w-full max-w-md"
                    size="medium"
                    required
                  />
                )}
              </form.AppField>
            </div>
          </form.Question>
        </form.WizardStep>
        <form.WizardStep
          name="asdfjkl;"
        >
          <form.Question
            question="What is your major?"
            className="w-full items-center text-center"
          >
            <div className="flex w-full flex-row flex-wrap justify-center gap-4">
              <form.AppField name="name.name">
                {(field) => (
                  <field.TextField
                    label="Organization Name"
                    className="w-full max-w-md"
                    size="medium"
                    required
                  />
                )}
              </form.AppField>
            </div>
          </form.Question>
        </form.WizardStep>
      </form.Wizard>
    </form.AppForm>
  );
};
  