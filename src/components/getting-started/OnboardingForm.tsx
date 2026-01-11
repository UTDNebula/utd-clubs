'use client';

import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import { useState } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import Panel from '@src/components/form/Panel';
import { SelectUserMetadataWithClubs } from '@src/server/db/models';

type StepObject = {
  id: string | number;
  label: string;
  description?: string;
};

const steps: StepObject[] = [
  { id: 1, label: 'Step 1' },
  { id: 2, label: 'Step 2' },
  { id: 3, label: 'Step 3' },
];

type OnboardingFormProps = {
  userMetadata?: SelectUserMetadataWithClubs;
  withLayout?: boolean;
  hideMobileStepper?: boolean;
};

export default function OnboardingForm({
  userMetadata,
  withLayout = false,
  hideMobileStepper = false,
}: OnboardingFormProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {},
  );
  // const [completedStepIds, setCompletedStepIds] = useState<
  //   Record<StepObject['id'], boolean>
  // >({});

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setCompletedSteps((prevCompletedSteps) => ({
        ...prevCompletedSteps,
        [activeStep]: true,
      }));
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setCompletedSteps((prevCompletedSteps) => ({
        ...prevCompletedSteps,
        [activeStep]: false,
      }));
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const BackButton = (
    <Button
      className="normal-case"
      loadingPosition="start"
      color="primary"
      onClick={handleBack}
      disabled={activeStep === 1}
    >
      Back
    </Button>
  );

  const NextButton = (
    <Button
      type={activeStep < steps.length ? undefined : 'submit'}
      variant="contained"
      className="normal-case"
      loadingPosition="start"
      color="primary"
      onClick={handleNext}
    >
      {activeStep < steps.length ? 'Next' : 'Finish'}
    </Button>
  );

  const OnboardingFormElement = (
    <>
      <BaseCard className="p-4 overflow-clip">
        <div>
          <Stepper>
            {steps.map((step, index) => (
              // <Step key={step.label} completed={completedSteps[index + 1]}>
              <Step key={step.label} completed={index < activeStep}>
                <StepButton
                  color="inherit"
                  onClick={() => {
                    setActiveStep(index + 1);
                  }}
                  disabled={index > activeStep}
                >
                  {step.label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </div>
      </BaseCard>
      <Panel className="shadow-lg">
        <h1 className="font-display text-4xl font-bold">Get Started</h1>
        {/* {`Welcome, ${userMetadata?.firstName}`} */}

        {`Step ${activeStep}`}

        <div
          className={`flex flex-row justify-end items-center gap-2 ${hideMobileStepper ? '' : 'max-sm:hidden sm:visible'}`}
        >
          {BackButton}
          {NextButton}
        </div>
      </Panel>
      <div
        className={`${hideMobileStepper ? 'hidden' : 'max-sm:visible sm:hidden'}`}
      >
        <MobileStepper
          variant="text"
          backButton={BackButton}
          nextButton={NextButton}
          steps={steps.length}
          activeStep={activeStep - 1}
          position="bottom"
          className="shadow-black/20 shadow-[0_-4px_15px_-3px]"
        />
      </div>
    </>
  );

  return withLayout ? (
    <div className="flex w-full flex-col items-center p-4">
      <div className="flex flex-col gap-8 w-full max-w-6xl">
        {OnboardingFormElement}
      </div>
    </div>
  ) : (
    <>{OnboardingFormElement}</>
  );
}
