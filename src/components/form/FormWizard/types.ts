import { ReactNode } from 'react';

type WizardStepObjectBase = {
  label: string;
  hidden?: boolean;
};

export type WizardStepObject<Fields> = WizardStepObjectBase &
  (
    | {
        id: string | number;
        variant?: 'body';
        fields: (keyof Fields)[];
      }
    | {
        id?: never;
        variant: 'start' | 'finish';
        fields?: never;
      }
  );

export type FormWizardStepProps = {
  /** Label shown in the stepper (required for body steps) */
  label?: string;
  /** Field names belonging to this step (used for validation) */
  fields?: string[];
  /** Step content */
  children: ReactNode;
  /** Marks this step as the intro screen (hidden from stepper, placed first) */
  startStep?: boolean;
  /** Marks this step as the completion screen (hidden from stepper, placed last) */
  finishStep?: boolean;
};

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

type StepConfigBase = {
  label: string;
  content: ReactNode;
  hidden: boolean;
};

export type StepConfig =
  | (StepConfigBase & { variant: 'body'; fields: string[] })
  | (StepConfigBase & { variant: 'start' | 'finish' });

export type ActiveStep = {
  index: number;
  previous: number | undefined;
};

export type WizardContextType = {
  activeStep: ActiveStep;
  steps: StepConfig[];
  goNext: () => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  goToFinish: () => void;
};
