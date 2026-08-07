import { DeepKeys } from '@tanstack/react-form';
import { MouseEventHandler, ReactElement, ReactNode, Ref } from 'react';

export type StepStateItem = {
  config?: WizardStepConfig;
  index: number;
};

export type StepState = {
  /** Current step */
  current: StepStateItem;
  /** Most recently visited step */
  previous: StepStateItem | undefined;
  /** Furthest visited step */
  furthest: StepStateItem;
};

/**
 * Actions that may be dispatched to the form wizard:
 * - `"next"` Validates current step and goes to next step if successful *(default for next button)*
 * - `"back"` Goes back to previous step *(default for back button)*
 * - `"target"` Goes to the step whose name matches {@linkcode WizardStepButtonConfig.targetStepName | targetStepName}
 * - `"submit"` Validates entire form and submits form if successful
 * - `"submitAndNext"` Validates entire form, submits form if successful, then goes to next step *(default for next button on last step)*
 * - `"reset"` Resets entire form and restarts wizard
 * - `"restart"` Restarts wizard from the first step without resetting the form's data
 * - `"none"` No action
 */
export type WizardAction =
  | 'next'
  | 'back'
  | 'target'
  | 'submit'
  | 'submitAndNext'
  | 'reset'
  | 'restart'
  | 'none';

/**
 * Configurations for the wizard's buttons, as these may differ between steps.
 */
export type WizardStepButtonConfig = {
  /** Label on button. */
  label?: string;
  /** Action that takes place when interacting with the button. */
  type?: WizardAction;
  /**
   * Name of step to jump to if {@linkcode WizardStepButtonConfig.type | type}
   * is `"target"` and button is interacted with.
   */
  targetStepName?: string;
  /**
   * Whether the button is disabled.
   * Also prevents using the stepper from skipping to steps past this button.
   */
  disabled?: boolean;
  /**
   * Whether the button is completely hidden.
   * Also prevents using the stepper from skipping to steps past this button.
   */
  hidden?: boolean;
  /**
   * A function to be called before the default action(s), as configured
   * through {@linkcode WizardStepButtonConfig.type | type}.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export type WizardStepConfig<TFormData = unknown> = {
  /** Form fields for step. */
  children?: ReactNode;
  /**
   * Unique identifier for the form step. Also used as the `name` prop for
   * `form.FormGroup`, which is used for validation and progression handling.
   *
   * **If this form step has fields that need to be validated, this prop MUST
   * match the key of the step's object in your schema.**
   *
   * For type safety and IntelliSense, pass your form's schema type into this
   * step's generic slot. Example below:
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
   *     <form.Wizard>
   *       <form.WizardStep<Schema> name="step1">
   *         // Notice this step has a "<Schema>" type argument. This adds type
   *         // safety and IntelliSense options to the name prop.
   *       </form.WizardStep>
   *       <form.WizardStep<Schema> name="step2">
   *         ...
   *       </form.WizardStep>
   *       <form.WizardStep name="finish" hidden>
   *         // For steps that don't need validation, you can omit "<Schema>"
   *         // and use an arbitrary (but unique) value for the name prop.
   *       </form.WizardStep>
   *     </form.Wizard>
   *   </form.AppForm>
   * );
   */
  name: DeepKeys<TFormData>;
  /** Label shown in stepper. */
  label?: string;
  /** Disables step entirely. Use this instead of conditionally rendering the `<form.WizardStep>` component. */
  disabled?: boolean;
  /** Hides step from stepper. */
  hidden?: boolean;
  /** Shows step in stepper, but functionally disables the step. */
  fake?: boolean;
  /** Prevents retreating to previous steps. Disables back button and stepper buttons for previous steps. */
  noBacktrack?: boolean;
  /** Prevents advancing to future steps. Disables next button and stepper buttons for future steps.  */
  noAdvance?: boolean;
  /** Configuration options for the next button for this step. */
  nextButtonConfig?: WizardStepButtonConfig;
  /** Configuration options for the back button for this step. */
  backButtonConfig?: WizardStepButtonConfig;
  /**
   * A function to be called for this step's stepper item. Called before jumping to this step.
   */
  onStepperClick?: MouseEventHandler<HTMLButtonElement>;
};

export type FormWizardStepProps<TFormData = unknown> =
  WizardStepConfig<TFormData>;

export type FormWizardProps = {
  /** Must be one or multiple `<FormWizardStep />`s. */
  children: ReactElement | ReactElement[];
  /** A function to be called when interacting with the next button on the last step. */
  onComplete?: () => void;
  /** Don't display the progress bar stepper on top */
  hideStepper?: boolean;
  ref?: Ref<WizardContextType>;
};

export type WizardActionDispatcher = (
  action: WizardAction,
  options?: {
    /**
     * Jump to this step if action is `"target"`. Can be a step object or a step name string.
     */
    targetStep?: WizardStepConfig | string;
    /**
     * Dispatches event unconditionally without form validation (except for submission actions).
     */
    noValidate?: boolean;
    /**
     * Allow jumping to a disabled step.
     */
    allowDisabled?: boolean;
  },
) => Promise<boolean>;

export type WizardMetaValues = {
  /**
   * Index of the furthest future step that is accessible. This means:
   *
   * - User is allowed to advance up to this step
   * - Step isn't disabled
   * - The step right before doesn't require submitting the form first
   * - The next button for the step right before isn't disabled or hidden
   *
   * This does NOT check if steps are valid; you should also use {@linkcode WizardMetaValues.earliestInvalidStepIndex | earliestInvalidStepIndex}.
   */
  latestAccessibleStepIndex: number;
  /**
   * Index of the earliest past step that is accessible. This means:
   *
   * - User is allowed to backtrack up to this step
   * - Step isn't disabled
   * - The back button for the step right after isn't disabled or hidden
   */
  earliestAccessibleStepIndex: number;
  /**
   * Index of the step right after the furthest step that isn't disabled or fake.
   */
  nextEnabledAfterFurthestStepIndex: number;
  /**
   * Index of the first step that is invalid.
   */
  earliestInvalidStepIndex: number;
  /**
   * Whether currently on the first step that isn't disabled or fake.
   */
  onFirstStep: boolean;
  /**
   * Whether currently on the last step that isn't disabled or fake.
   */
  onLastStep: boolean;
};

export interface WizardContextType {
  /**
   * Function to safely call an action from the wizard.
   *
   * @param {WizardAction} action The action to dispatch to the wizard.
   * @param options Additional options that may be required depending on `action`
   *
   * @returns Whether the action was successful.
   */
  dispatchWizardAction: WizardActionDispatcher;
  /**
   * Configuration object and index of the following steps:
   * - Current step
   * - Most recently visited step
   * - Furthest visited step
   */
  stepState: StepState;
  /**
   * Array of all steps registered to the wizard
   */
  steps: WizardStepConfig[];
  meta: WizardMetaValues;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WizardRef extends WizardContextType {}
