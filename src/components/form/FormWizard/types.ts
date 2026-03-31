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
  /** Label shown in the stepper */
  label: string;
  /** Field names belonging to this step (used for validation) */
  fields?: string[];
  /** Step content */
  children: ReactNode;
};

export type FormWizardProps = {
  /** Content for an optional intro screen (hidden from stepper) */
  startStep?: ReactNode;
  /** Content for an optional completion screen (hidden from stepper) */
  finishStep?: ReactNode;
  /** Called when the user clicks "Continue" on the finish step */
  onComplete?: () => void;
  /**
   * If true, automatically advances to the finish step after successful
   * form submission. Defaults to true when finishStep is provided.
   */
  autoAdvanceOnSubmit?: boolean;
  /** Wizard step children */
  children: ReactNode;
};

export type StepConfig = {
  label: string;
  fields: string[];
  content: ReactNode;
  variant: 'start' | 'body' | 'finish';
  hidden: boolean;
};

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
