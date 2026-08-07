'use client';

import { createContext, useContext } from 'react';
import { WizardContextType } from './types';

const defaultContext: WizardContextType = {
  dispatchWizardAction: async () => false,
  stepState: {
    current: { index: 0 },
    previous: undefined,
    furthest: { index: 0 },
  },
  steps: [],
  meta: {
    latestAccessibleStepIndex: Infinity,
    earliestAccessibleStepIndex: -1,
    nextEnabledAfterFurthestStepIndex: 1,
    earliestInvalidStepIndex: Infinity,
    onFirstStep: true,
    onLastStep: false,
  },
};

const WizardContext = createContext<WizardContextType>(defaultContext);

export default WizardContext;

export function useWizardContext() {
  return useContext(WizardContext);
}
