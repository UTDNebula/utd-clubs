'use client';

import { FormWizardStepProps } from './types';

/**
 * A single customizable step for FormWizard. Corresponds to a FormGroup.
 *
 * Must be direct descendants of a single `<FormWizard />` component.
 *
 * @example
 * const schema = z.object({
 *   step1: z.object({
 *     name: z.string(),
 *   }),
 *   step2: z.object({
 *     email: z.email(),
 *   }),
 * });
 *
 * type Schema = z.infer<typeof schema>;
 *
 * const form = useAppForm({
 *   validators: { onSubmit: schema },
 * });
 *
 * return (
 *   <form.AppForm>
 *     <form.Wizard onComplete={() => router.push('/')}>
 *       <form.WizardStep name="welcome" hidden>
 *         <h1>Welcome!</h1>
 *       </form.WizardStep>
 *       <form.WizardStep<Schema> name="step1" label="Step 1">
 *         ...Step 1 form fields...
 *       </form.WizardStep>
 *       <form.WizardStep<Schema> name="step2" label="Step 2">
 *         ...Step 2 form fields...
 *       </form.WizardStep>
 *     </form.Wizard>
 *   </form.AppForm>
 * );
 */
function FormWizardStep<TFormData>({
  children,
}: FormWizardStepProps<TFormData>) {
  return <>{children}</>;
}

FormWizardStep._isWizardStep = true;

export default FormWizardStep;
