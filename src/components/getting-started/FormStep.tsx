import { ReactNode, Ref } from 'react';
import { withForm } from '@src/utils/form';
import { AccountOnboardingSchema } from '@src/utils/formSchemas';

export type StepObject = {
  id: string | number;
  label: string;
  description?: string;
};

type FormData = Partial<AccountOnboardingSchema>;

const FormStep = withForm({
  defaultValues: {} as FormData,
  props: {
    step: {} as StepObject,
    // id: '',
    active: false,
    // ref: null as Ref<HTMLDivElement> | undefined,
    // ref: undefined as ((node: HTMLDivElement) => HTMLDivElement) | undefined,
  },
  render: function Render({ form, step, active }) {
    let FormStepData: ReactNode;

    switch (step.id) {
      case 1:
        FormStepData = (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-6">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField label="First Name" className="grow" />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField label="Last Name" className="grow" />
                )}
              </form.AppField>
            </div>
            <div className="flex flex-wrap gap-6">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField label="First Name" className="grow" />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField label="Last Name" className="grow" />
                )}
              </form.AppField>
            </div>
            <div className="flex flex-wrap gap-6">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField label="First Name" className="grow" />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField label="Last Name" className="grow" />
                )}
              </form.AppField>
            </div>
          </div>
        );
        break;
      case 2:
        FormStepData = <div>step 2</div>;
        break;
      case 3:
        FormStepData = <div>step 3</div>;
        break;
      default:
        FormStepData = <div></div>;
        break;
    }
    return (
      <div id={active ? 'active-form-step' : undefined}>
        {FormStepData}
      </div>
    );
  },
});

export default FormStep;
