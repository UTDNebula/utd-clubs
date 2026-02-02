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
