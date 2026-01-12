'use client';

import { LeakRemoveTwoTone } from '@mui/icons-material';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import Slide from '@mui/material/Slide';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import { useMutation } from '@tanstack/react-query';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import Panel from '@src/components/form/Panel';
import { SelectUserMetadataWithClubs } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import {
  accountOnboardingSchema,
  AccountOnboardingSchema,
} from '@src/utils/formSchemas';
import FormStep, { StepObject } from './FormStep';

export const steps: StepObject[] = [
  { id: 1, label: 'Step 1' },
  { id: 2, label: 'Step 2' },
  { id: 3, label: 'Step 3' },
];

// function usePrevious<T>(value: T): T | undefined {
//   const currentRef = useRef<T>(value);
//   const previousRef = useRef<T>(undefined);

//   useEffect(() => {
//     if (currentRef.current !== value) {
//       previousRef.current = currentRef.current;
//       previousRef.current = value;
//     }
//   }, [value]);

//   return previousRef.current;
// }

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
  const api = useTRPC();

  const editAccountMutation = useMutation(
    api.userMetadata.updateById.mutationOptions({}),
  );

  const [defaultValues, setDefaultValues] = useState<
    Partial<AccountOnboardingSchema>
  >({
    firstName: userMetadata?.firstName,
    lastName: userMetadata?.lastName,
    major: userMetadata?.major,
    minor: userMetadata?.minor,
    studentClassification: userMetadata?.studentClassification,
    // `userMetadata.graduation` is automatically set with a time zone, which shows the wrong month in the date picker
    // Add the timezone offset (in milliseconds) to convert back to UTC
    graduationDate: userMetadata?.graduationDate
      ? new Date(
          userMetadata?.graduationDate?.getTime() +
            userMetadata?.graduationDate?.getTimezoneOffset() * 60 * 1000,
        )
      : undefined,
    contactEmail: userMetadata?.contactEmail ?? '',
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      try {
        const updated = await editAccountMutation.mutateAsync({
          updateUser: value,
        });
        if (updated) {
          const updatedFixed = {
            ...updated,
            graduationDate: updated?.graduationDate
              ? new Date(
                  updated?.graduationDate?.getTime() +
                    updated?.graduationDate?.getTimezoneOffset() * 60 * 1000,
                )
              : null,
          };

          setDefaultValues(updatedFixed);
          formApi.reset(updatedFixed);
        }
      } catch (e) {
        console.error(e);
      }
    },
    validators: { onChange: accountOnboardingSchema },
  });

  /*
   * Steps
   */

  // const [activeStep, setActiveStep] = useState(1);
  const [activeStep, setActiveStep] = useState({
    current: 1,
    previous: undefined as number | undefined,
  });
  // const prevActiveStep = usePrevious(activeStep);

  const [transitioning, setTransitioning] = useState(false);
  const [mounting, setMounting] = useState(true);
  // const mounting = useRef(true);
  // let mounting = true;

  // useEffect(() => {
  //   if (activeStep) {
  //     setTransitioning(true);

  //     const timer = setTimeout(() => {
  //       setTransitioning(false);
  //     }, 250);

  //     return () => clearTimeout(timer);
  //   }
  // }, [activeStep]);

  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {},
  );
  // const [completedStepIds, setCompletedStepIds] = useState<
  //   Record<StepObject['id'], boolean>
  // >({});

  const [formHeight, setFormHeight] = useState(0);
  // const formStepRef = useRef<HTMLDivElement>(null);
  // const [formStepRef, setFormStepRef] = useState<HTMLDivElement>(null);

  const measureFormStepRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setTransitioning(true);

      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 250);

      setMounting(false);
      // mounting.current = false;
      // mounting = false;

      const height = node.clientHeight;
      console.log('node height', height);
      setFormHeight(height);

      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setFormHeight(entry.contentRect.height);
        });
      });

      observer.observe(node);

      return () => {
        observer.disconnect();
        clearTimeout(timer);
      };
    }
    // formStepRef.current = node;
  }, []);

  const updateHeight = () => {
    // if (setFormStepRef.current) {
    //   const height = setFormStepRef.current.clientHeight;
    //   console.log('height', height);
    //   setFormHeight(height);
    // }
  };

  // useLayoutEffect(() => {
  //   // console.log('useLayoutEffect');
  //   // if (formStepRef.current) {
  //   //   const height = formStepRef.current.clientHeight;
  //   //   console.log('height', height);
  //   //   setFormHeight(height);
  //   // }

  //   if (formStepRef.current) {
  //     const observer = new ResizeObserver((entries) => {
  //       entries.forEach((entry) => {
  //         setFormHeight(entry.contentRect.height);
  //       });
  //     });

  //     observer.observe(formStepRef.current);

  //     return () => {
  //       observer.disconnect();
  //     };
  //   }
  // }, []);

  const handleNext = () => {
    if (activeStep.current < steps.length) {
      setActiveStep((prev) => ({
        current: prev.current + 1,
        previous: prev.current,
      }));
      setCompletedSteps((prevCompletedSteps) => ({
        ...prevCompletedSteps,
        [activeStep.current]: true,
      }));
    }
  };

  const handleBack = () => {
    if (activeStep.current > 0) {
      setCompletedSteps((prevCompletedSteps) => ({
        ...prevCompletedSteps,
        [activeStep.current]: false,
      }));
      setActiveStep((prev) => ({
        current: prev.current - 1,
        previous: prev.current,
      }));
    }
  };

  const BackButton = (
    <Button
      className="normal-case"
      loadingPosition="start"
      color="primary"
      onClick={handleBack}
      disabled={activeStep.current === 1}
    >
      Back
    </Button>
  );

  // const handleSwitch = () => {
  //   const element = document.getElementById('active-form-step');

  //   element?.offsetHeight;
  // };

  const NextButton = (
    <Button
      // type={activeStep < steps.length ? undefined : 'submit'}
      variant="contained"
      className="normal-case"
      loadingPosition="start"
      color="primary"
      onClick={handleNext}
    >
      {activeStep.current < steps.length ? 'Next' : 'Finish'}
    </Button>
  );

  const OnboardingFormElement = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-8 w-full"
    >
      <BaseCard className="p-4 overflow-clip">
        <div>
          <Stepper>
            {steps.map((step, index) => (
              // <Step key={step.label} completed={completedSteps[index + 1]}>
              <Step key={step.label} completed={index < activeStep.current}>
                <StepButton
                  color="inherit"
                  onClick={() => {
                    setActiveStep((prev) => ({
                      current: index + 1,
                      previous: prev.current,
                    }));
                  }}
                  disabled={index > activeStep.current}
                >
                  {step.label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </div>
      </BaseCard>
      <Panel className="shadow-lg overflow-clip">
        {/* <Slide in direction="left" timeout={500} mountOnEnter unmountOnExit> */}
        <div>
          <h1 className="font-display text-4xl font-bold ml-2">Get Started</h1>
          {/* <p>{`Transitioning: ${transitioning}`}</p> */}
          {/* {`Welcome, ${userMetadata?.firstName}`} */}

          <div
            className="relative ml-2 my-4 transition-[height] duration-250 ease-in-out"
            style={
              mounting
                ? undefined
                : {
                    height: `${formHeight}px`,
                    transitionDuration: transitioning ? '250' : '0',
                  }
            }
          >
            <div className="invisible">
              <FormStep form={form} step={steps[0]} active={false} />
            </div>

            {steps.map((step, index) => {
              const stepNumber =
                steps.findIndex((searchStep) => searchStep.id === step.id) + 1;

              const isActive = activeStep.current === stepNumber;
              // if (isActive) console.log('IN!');

              const direction = activeStep.previous
                ? activeStep.current > activeStep.previous
                  ? // on next
                    activeStep.current === stepNumber
                    ? // entering
                      'left'
                    : // exiting
                      'right'
                  : // on back
                    activeStep.current === stepNumber
                    ? // entering
                      'right'
                    : // exiting
                      'left'
                : // on mount
                  'left';

              // console.log(isActive, activeStep.current === stepNumber);

              return (
                <Slide
                  key={index}
                  direction={direction}
                  timeout={250}
                  mountOnEnter
                  unmountOnExit
                  in={isActive}
                  className={`absolute top-0 left-0 ${mounting ? 'invisible' : ''}`}
                  // easing={{ enter: 'linear', exit: 'linear' }}
                >
                  <div ref={isActive ? measureFormStepRef : undefined}>
                    {/* <p>{`active: ${activeStep.current}`}</p>
                    <p>{`prev: ${activeStep.previous}`}</p>
                    <p>{`stepNumber: ${stepNumber}`}</p> */}
                    <FormStep form={form} step={step} active={isActive} />
                  </div>
                </Slide>
              );
            })}
          </div>

          <div
            className={`flex flex-row justify-end items-center gap-2 ${hideMobileStepper ? '' : 'max-sm:hidden sm:visible'}`}
          >
            {BackButton}
            {NextButton}
          </div>
        </div>
        {/* </Slide> */}
      </Panel>
      <div
        className={`${hideMobileStepper ? 'hidden' : 'max-sm:visible sm:hidden'}`}
      >
        <MobileStepper
          variant="text"
          backButton={BackButton}
          nextButton={NextButton}
          steps={steps.length}
          activeStep={activeStep.current - 1}
          position="bottom"
          className="shadow-black/20 shadow-[0_-4px_15px_-3px]"
        />
      </div>
    </form>
  );

  return withLayout ? (
    <div
      className={`flex w-full flex-col items-center p-4 ${hideMobileStepper ? '' : 'max-sm:pb-10'}`}
    >
      <div className="w-full max-w-6xl">{OnboardingFormElement}</div>
    </div>
  ) : (
    <>{OnboardingFormElement}</>
  );
}
