import { DeepKeys } from '@tanstack/react-form';
import { MouseEventHandler, ReactNode } from 'react';

/**
 * Configurations for the wizard buttons that may differ between steps
 */
export type WizardStepButtonConfig = {
  /** Label on button. */
  label?: string;
  /**
   * Action that takes place when interacting with the button.
   * - `"next"` Validates current step and goes to next step if successful
   * - `"back"` Goes back to previous step
   * - `"target"` Goes to the step whose name matches {@linkcode WizardStepButtonConfig.targetStepName | targetStepName}
   * - `"submit"` Validates entire form and submits form if successful
   * - `"submitAndNext"` Validates entire form, submits form if successful, then goes to next step
   * - `"reset"` Resets the current step
   */
  type?: 'next' | 'back' | 'target' | 'submit' | 'submitAndNext' | 'reset';
  /** Step's name to jump to, if {@linkcode WizardStepButtonConfig.type | type} is `"target"`. */
  targetStepName?: string;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Whether the button is completely hidden. */
  hidden?: boolean;
  /** A function to be called before the default action(s), as configured through {@linkcode WizardStepButtonConfig.type | type}. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type FormWizardStepPropsBase<TFormData> = {
  /** Step content */
  children?: ReactNode;
  /** Name of form group */
  name: DeepKeys<TFormData>;
  /** Label shown in the stepper */
  label?: string;
  /** Hides step from stepper */
  hidden?: boolean;
  /** Configuration options for the next button for this step. */
  nextButtonConfig?: WizardStepButtonConfig;
  /** Configuration options for the back button for this step. */
  backButtonConfig?: WizardStepButtonConfig;
};

export type FormWizardStepProps<TFormData = unknown> =
  FormWizardStepPropsBase<TFormData>;

export type FormWizardProps = {
  /** Called when the user clicks "Continue" on the finish step */
  onComplete?: () => void;
  /**
   * If true, automatically advances to the finish step after successful
   * form submission. Defaults to true when a finishStep child is present.
   */
  autoAdvanceOnSubmit?: boolean;
  /** Wizard step children */
  children: ReactNode;
};

type StepConfigBase<TFormData> = {
  render: ReactNode;
  name: DeepKeys<TFormData>;
  label: string;
  hidden: boolean;
};

export type StepConfig<TFormData = unknown> = StepConfigBase<TFormData>;

export type WizardContextType = {
  activeStep: number;
  previousStep: number | undefined;
  steps: StepConfig[];
  goNext: () => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  goToFinish: () => void;
};
