'use client';

import { createContext, useContext } from 'react';
import { WizardContextType } from './types';

const defaultContext: WizardContextType = {
  activeStep: 0,
  previousStep: undefined,
  steps: [],
  goNext: () => {},
  goBack: () => {},
  goToStep: () => {},
  goToFinish: () => {},
};

export const WizardContext = createContext<WizardContextType>(defaultContext);

export function useWizardContext() {
  return useContext(WizardContext);
}
