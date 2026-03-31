'use client';

import { createContext, useContext } from 'react';
import { WizardContextType } from './types';

const defaultContext: WizardContextType = {
  activeStep: { index: 0, previous: undefined },
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
