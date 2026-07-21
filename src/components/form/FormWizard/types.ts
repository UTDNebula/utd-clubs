import { DeepKeys } from '@tanstack/react-form';
import { MouseEventHandler, ReactElement, ReactNode } from 'react';

export type StepStateConfig = {
  config?: WizardStepConfig;
  index: number;
};

export type StepState = {
  current: StepStateConfig;
  previous: StepStateConfig | undefined;
  furthest: StepStateConfig;
};

/**
 * Actions that may be dispatched to the form wizard:
 * - `"next"` Validates current step and goes to next step if successful *(default for next button)*
 * - `"back"` Goes back to previous step *(default for back button)*
 * - `"target"` Goes to the step whose name matches {@linkcode WizardStepButtonConfig.targetStepName | targetStepName}
 * - `"submit"` Validates entire form and submits form if successful
 * - `"submitAndNext"` Validates entire form, submits form if successful, then goes to next step *(default for next button on last step)*
 * - `"reset"` Resets entire form
 */
export type WizardAction =
  | 'next'
  | 'back'
  | 'target'
  | 'submit'
  | 'submitAndNext'
  | 'reset';

/**
 * Configurations for the wizard buttons that may differ between steps
 */
export type WizardStepButtonConfig = {
  /** Label on button. */
  label?: string;
  /** Action that takes place when interacting with the button. */
  type?: WizardAction;
  /** Step's name to jump to, if {@linkcode WizardStepButtonConfig.type | type} is `"target"`. */
  targetStepName?: string;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Whether the button is completely hidden. */
  hidden?: boolean;
  /** A function to be called before the default action(s), as configured through {@linkcode WizardStepButtonConfig.type | type}. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export type WizardStepConfig<TFormData = unknown> = {
  /** Step content */
  children?: ReactNode;
  /** Name of form group */
  name: DeepKeys<TFormData>;
  /** Label shown in the stepper */
  label?: string;
  /** Disables the step entirely. Use this instead of conditionally rendering the `<form.WizardStep>` component */
  disabled?: boolean;
  /** Hides step from stepper */
  hidden?: boolean;
  /** Configuration options for the next button for this step. */
  nextButtonConfig?: WizardStepButtonConfig;
  /** Configuration options for the back button for this step. */
  backButtonConfig?: WizardStepButtonConfig;
};

export type FormWizardStepProps<TFormData = unknown> =
  WizardStepConfig<TFormData>;

export type FormWizardProps = {
  /** Wizard step children */
  children: ReactElement | ReactElement[];
  /** A function to be called when interacting with the next button on the last step. */
  onComplete?: () => void;
  /** Don't display the progress bar stepper on top */
  hideStepper?: boolean;
};

export type WizardContextType = {
  activeStep: number;
  previousStep: number | undefined;
  steps: WizardStepConfig[];
  goNext: () => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  goToFinish: () => void;
};
