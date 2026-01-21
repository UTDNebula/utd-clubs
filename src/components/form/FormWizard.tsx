type WizardStepObjectBase = {
  label: string;
  hidden?: boolean;
};

export type WizardStepObject = WizardStepObjectBase &
  (
    | {
        id: string | number;
        variant?: 'body';
      }
    | {
        id?: never;
        variant: 'start' | 'finish';
      }
  );
