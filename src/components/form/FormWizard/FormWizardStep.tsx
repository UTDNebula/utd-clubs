'use client';

import { ReactNode } from 'react';
import { FormWizardStepProps } from './types';

type WizardStepComponent = ((props: FormWizardStepProps) => ReactNode) & {
  _isWizardStep: true;
};

/**
 * Declarative step component for FormWizard.
 * FormWizard reads its props via React.Children to build step configuration.
 * The component itself simply renders its children when active.
 */
const FormWizardStep: WizardStepComponent = ({ children }) => {
  return <>{children}</>;
};

FormWizardStep._isWizardStep = true;

export default FormWizardStep;
