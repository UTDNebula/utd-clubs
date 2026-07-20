'use client';

import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Children,
  isValidElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BaseCard } from '@nebula-library/components/BaseCard';
import Panel from '@nebula-library/components/Panel';
import { useAppForm, useFormContext } from '@src/utils/form';
import { FormWizardProps, FormWizardStepProps, StepConfig } from './types';
import { WizardContext } from './WizardContext';

/**
 * Reusable multi-step form wizard that integrates with TanStack Form.
 *
 * @example
 * const form = useAppForm({...})
 *
 * <form.Wizard onComplete={() => router.push('/')}>
 *   <form.WizardStep startStep>
 *     ...
 *   </form.WizardStep>
 *   <form.WizardStep label="Name" fields={['firstName', 'lastName']}>
 *     ...form fields...
 *   </form.WizardStep>
 *   <form.WizardStep finishStep>
 *     ...
 *   </form.WizardStep>
 * </form.Wizard>
 */
export default function FormWizard({
  onComplete,
  autoAdvanceOnSubmit,
  children,
}: FormWizardProps) {
  const form = useFormContext() as unknown as ReturnType<typeof useAppForm>;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Build step config from children
  const steps = useMemo<StepConfig[]>(() => {
    const result: StepConfig[] = [];

    Children.toArray(children).forEach((child) => {
      if (
        isValidElement(child) &&
        typeof child.type !== 'string' &&
        '_isWizardStep' in child.type
      ) {
        const props = child.props as FormWizardStepProps & {
          children: ReactNode;
        };

        result.push({
          name: props.name,
          label: props.label ?? props.name ?? '',
          render: props.children,
          hidden: props.hidden ?? false,
        });
      }
    });

    return result;
  }, [children]);

  const hasStart = true;
  const hasFinish = true;

  // const hasStart = steps[0]?.variant === 'start';
  // const hasFinish = steps[steps.length - 1]?.variant === 'end';
  const shouldAutoAdvanceOnSubmit = autoAdvanceOnSubmit ?? hasFinish;

  // Step navigation state
  const [activeStepState, setActiveStepState] = useState<{
    index: number;
    previous: number | undefined;
  }>({
    index: 0,
    previous: undefined,
  });

  const setActiveStep = (value: React.SetStateAction<number>) => {
    setActiveStepState((prev) => ({
      index: typeof value === 'function' ? value(prev.index) : value,
      previous: prev.index,
    }));
  };

  const activeStep = activeStepState.index;
  const previousStep = activeStepState.previous;

  // Loading state to prevent flash before first render measurement
  const [mounting, setMounting] = useState(true);

  // Dynamic height for absolutely-positioned step content
  const [formHeight, setFormHeight] = useState(0);

  const observerRef = useRef<ResizeObserver | null>(null);

  const measureFormStepRef = useCallback((node: HTMLDivElement | null) => {
    // Disconnect previous observer when ref detaches (React calls with null)
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node !== null) {
      setMounting(false);
      setFormHeight(node.clientHeight);

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) setFormHeight(entry.contentRect.height);
      });
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  // Last body step index (the step that triggers form submission)
  const lastBodyIndex = hasFinish ? steps.length - 2 : steps.length - 1;

  // Navigation
  const goNext = useCallback(() => {
    if (activeStep < lastBodyIndex) {
      setActiveStep((prev) => prev + 1);
    } else if (hasFinish && activeStep === steps.length - 1) {
      onComplete?.();
    }
  }, [activeStep, lastBodyIndex, hasFinish, steps.length, onComplete]);

  const goBack = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  }, [activeStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (index < activeStep) {
        setActiveStep(index);
      } else if (index > activeStep) {
        if (index - 1 > activeStep) return;
        setActiveStep(index);
      }
    },
    [activeStep],
  );

  // Advance to finish step after successful form submission
  const goToFinish = useCallback(() => {
    if (hasFinish) {
      setActiveStep(steps.length - 1);
    }
  }, [hasFinish, steps.length]);

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    // Always prevent native submit; we call form.handleSubmit() explicitly
    event.preventDefault();

    if (activeStep < lastBodyIndex) {
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === lastBodyIndex) {
      // Submit the form; only advance to the finish step once the API call
      // resolves successfully so the step does not jump early
      void form.handleSubmit().then(() => {
        if (
          form.store.state.isSubmitSuccessful &&
          shouldAutoAdvanceOnSubmit &&
          hasFinish
        ) {
          setActiveStep(steps.length - 1);
        }
      });
    } else if (hasFinish && activeStep === steps.length - 1) {
      // "Continue" button on finish screen
      onComplete?.();
    }
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      activeStep,
      previousStep,
      steps,
      goNext,
      goBack,
      goToStep,
      goToFinish,
    }),
    [activeStep, previousStep, steps, goNext, goBack, goToStep, goToFinish],
  );

  // Button labels and states
  const isOnFinishStep = hasFinish && activeStep === steps.length - 1;
  const isOnLastBodyStep = activeStep === lastBodyIndex;
  const isOnStartStep = hasStart && activeStep === 0;

  const nextButtonLabel = isOnFinishStep
    ? 'Continue'
    : isOnLastBodyStep
      ? 'Submit'
      : isOnStartStep
        ? 'Start'
        : 'Next';

  const currentFieldsValid = true;

  const formGroupApis = form.formGroupApis.values().toArray();

  return (
    <WizardContext.Provider value={contextValue}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex w-full flex-col gap-8"
        noValidate
      >
        <div>
          <Button
            onClick={() => {
              console.log(
                'formGroupMetaDerived',
                form.formGroupMetaDerived.get(),
              );
              console.log(
                'values',
                Object.entries(form.formGroupMetaDerived.get()).forEach(
                  ([name, value]) => {
                    console.log(`${name} is submitted`, value.isSubmitted);
                  },
                ),
              );
            }}
          >
            log
          </Button>
          <Button
            onClick={() => {
              const foundGroupApi = formGroupApis.find(
                (groupApi) => groupApi.name === 'name',
              );
              console.log('foundGroupApi', foundGroupApi);
              foundGroupApi?.handleSubmit();
            }}
          >
            submit
          </Button>
        </div>

        <BaseCard className="overflow-clip py-4 max-sm:px-0 sm:px-2">
          <div>
            <Stepper alternativeLabel={isSmallScreen}>
              {steps.map((step, index) => {
                if (!step.hidden) {
                  return (
                    <Step
                      key={step.label}
                      completed={index < activeStep}
                      active={index === activeStep}
                    >
                      <StepButton
                        color="inherit"
                        onClick={() => goToStep(index)}
                        disabled={
                          index - 1 > activeStep ||
                          isOnFinishStep ||
                          (!currentFieldsValid && index >= activeStep)
                        }
                      >
                        <StepLabel
                          className="cursor-pointer"
                          error={!currentFieldsValid && index === activeStep}
                        >
                          {step.label}
                        </StepLabel>
                      </StepButton>
                    </Step>
                  );
                }
              })}
            </Stepper>
          </div>
        </BaseCard>
        <Panel className="overflow-clip shadow-lg">
          <div
            className="relative mb-4 transition-[height] duration-250 ease-in-out"
            style={mounting ? undefined : { height: `${formHeight}px` }}
          >
            {/* Hidden step for initial sizing */}
            {mounting && (
              <div className="invisible">
                <div className="mx-2">{steps[0]?.render}</div>
              </div>
            )}

            {steps.map((step, index) => {
              const isActive = activeStep === index;

              // Determines the direction of the slide transition
              const direction =
                previousStep !== undefined
                  ? activeStep > previousStep
                    ? // on next
                      activeStep === index
                      ? 'left' // entering
                      : 'right' // exiting
                    : // on back
                      activeStep === index
                      ? 'right' // entering
                      : 'left' // exiting
                  : // on mount
                    'left';

              return (
                <Slide
                  key={index}
                  direction={direction}
                  timeout={250}
                  mountOnEnter
                  unmountOnExit
                  in={isActive}
                  className={`absolute top-0 left-0 ${mounting ? 'invisible' : ''}`}
                >
                  <div ref={isActive ? measureFormStepRef : undefined}>
                    <div className="mx-2">
                      <form.FormGroup
                        name={step.name ?? step.label ?? `_unknown-${index}`}
                      >
                        {() => <>{step.render}</>}
                      </form.FormGroup>
                    </div>
                  </div>
                </Slide>
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              className={`normal-case ${isOnFinishStep ? 'invisible' : ''}`}
              loadingPosition="start"
              color="primary"
              onClick={goBack}
              disabled={activeStep === 0 || isOnFinishStep}
            >
              Back
            </Button>
            <Button
              variant="contained"
              className="normal-case"
              disabled={!currentFieldsValid}
              loading={form.state.isSubmitting}
              loadingPosition="start"
              color={!currentFieldsValid ? 'inherit' : 'primary'}
              onClick={handleNext}
            >
              {nextButtonLabel}
            </Button>
          </div>
        </Panel>
      </form>
    </WizardContext.Provider>
  );
}
