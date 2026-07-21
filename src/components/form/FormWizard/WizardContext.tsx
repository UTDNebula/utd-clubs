'use client';

import { createContext, useContext } from 'react';
import { WizardContextType } from './types';

const defaultContext: WizardContextType = {
  dispatchWizardAction: () => {},
  stepState: {
    current: { index: 0 },
    previous: undefined,
    furthest: { index: 0 },
  },
  steps: [],
  meta: {
    nextInaccessibleStepIndex: Infinity,
    prevInaccessibleStepIndex: -1,
    nextFromFurthestEnabledStepIndex: 1,
    onFirstStep: true,
    onLastStep: false,
  },
};

export const WizardContext = createContext<WizardContextType>(defaultContext);

export function useWizardContext() {
  return useContext(WizardContext);
}
