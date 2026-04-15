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
import { BaseCard } from '@src/components/common/BaseCard';
import Panel from '@src/components/common/Panel';
import { useFormContext } from '@src/utils/form';
import {
  ActiveStep,
  FormWizardProps,
  FormWizardStepProps,
  StepConfig,
} from './types';
import { useWizardContext, WizardContext } from './WizardContext';

/**
 * Reusable multi-step form wizard that integrates with TanStack Form.
 *
 * Usage:
 * ```tsx
 * <form.Wizard onComplete={() => router.push('/')}>
 *   <form.WizardStep startStep>
 *     <Intro />
 *   </form.WizardStep>
 *   <form.WizardStep label="Name" fields={['firstName', 'lastName']}>
 *     ...form fields...
 *   </form.WizardStep>
 *   <form.WizardStep finishStep>
 *     <Done />
 *   </form.WizardStep>
 * </form.Wizard>
 * ```
 */
export default function FormWizard({
  onComplete,
  autoAdvanceOnSubmit,
  children,
}: FormWizardProps) {
  const form = useFormContext();
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

        if (props.startStep) {
          result.push({
            label: props.label ?? 'Get Started',
            content: props.children,
            variant: 'start',
            hidden: true,
          });
        } else if (props.finishStep) {
          result.push({
            label: props.label ?? 'Finish',
            content: props.children,
            variant: 'finish',
            hidden: true,
          });
        } else {
          result.push({
            label: props.label ?? '',
            fields: props.fields ?? [],
            content: props.children,
            variant: 'body',
            hidden: false,
          });
        }
      }
    });

    return result;
  }, [children]);

  const hasStart = steps[0]?.variant === 'start';
  const hasFinish = steps[steps.length - 1]?.variant === 'finish';
  const shouldAutoAdvance = autoAdvanceOnSubmit ?? hasFinish;

  // Step navigation state
  const [activeStep, setActiveStep] = useState<ActiveStep>({
    index: 0,
    previous: undefined,
  });

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

  // Validation helpers
  const validateStepFields = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      if (step?.variant !== 'body' || !step.fields.length) return;
      step.fields.forEach((field) =>
        form.validateField(field as never, 'change'),
      );
    },
    [steps, form],
  );

  const areStepFieldsValid = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      if (step?.variant !== 'body' || !step.fields.length) return true;
      return step.fields.every(
        (field) =>
          (
            form.state.fieldMeta as Record<
              string,
              { isValid?: boolean } | undefined
            >
          )[field]?.isValid ?? true,
      );
    },
    [steps, form.state.fieldMeta],
  );

  // Last body step index (the step that triggers form submission)
  const lastBodyIndex = hasFinish ? steps.length - 2 : steps.length - 1;

  // Navigation
  const goNext = useCallback(() => {
    validateStepFields(activeStep.index);
    if (!areStepFieldsValid(activeStep.index)) return;

    if (activeStep.index < lastBodyIndex) {
      setActiveStep((prev) => ({
        index: prev.index + 1,
        previous: prev.index,
      }));
    } else if (hasFinish && activeStep.index === steps.length - 1) {
      onComplete?.();
    }
  }, [
    activeStep,
    lastBodyIndex,
    hasFinish,
    steps.length,
    onComplete,
    validateStepFields,
    areStepFieldsValid,
  ]);

  const goBack = useCallback(() => {
    if (activeStep.index > 0) {
      setActiveStep((prev) => ({
        index: prev.index - 1,
        previous: prev.index,
      }));
    }
  }, [activeStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (index < activeStep.index) {
        setActiveStep((prev) => ({
          index: index,
          previous: prev.index,
        }));
      } else if (index > activeStep.index) {
        validateStepFields(activeStep.index);
        if (!areStepFieldsValid(activeStep.index)) return;
        if (index - 1 > activeStep.index) return;
        setActiveStep((prev) => ({
          index: index,
          previous: prev.index,
        }));
      }
    },
    [activeStep, validateStepFields, areStepFieldsValid],
  );

  // Advance to finish step after successful form submission
  const goToFinish = useCallback(() => {
    if (hasFinish) {
      setActiveStep((prev) => ({
        index: steps.length - 1,
        previous: prev.index,
      }));
    }
  }, [hasFinish, steps.length]);

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    // Always prevent native submit; we call form.handleSubmit() explicitly
    event.preventDefault();

    validateStepFields(activeStep.index);
    if (!areStepFieldsValid(activeStep.index)) return;

    if (activeStep.index < lastBodyIndex) {
      setActiveStep((prev) => ({
        index: prev.index + 1,
        previous: prev.index,
      }));
    } else if (activeStep.index === lastBodyIndex) {
      // Submit the form; only advance to the finish step once the API call
      // resolves successfully so the step does not jump early
      void form.handleSubmit().then(() => {
        if (
          form.store.state.isSubmitSuccessful &&
          shouldAutoAdvance &&
          hasFinish
        ) {
          setActiveStep({
            index: steps.length - 1,
            previous: activeStep.index,
          });
        }
      });
    } else if (hasFinish && activeStep.index === steps.length - 1) {
      // "Continue" button on finish screen
      onComplete?.();
    }
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      activeStep,
      steps,
      goNext,
      goBack,
      goToStep,
      goToFinish,
    }),
    [activeStep, steps, goNext, goBack, goToStep, goToFinish],
  );

  // Button labels and states
  const isOnFinishStep = hasFinish && activeStep.index === steps.length - 1;
  const isOnLastBodyStep = activeStep.index === lastBodyIndex;
  const isOnStartStep = hasStart && activeStep.index === 0;

  const nextButtonLabel = isOnFinishStep
    ? 'Continue'
    : isOnLastBodyStep
      ? 'Submit'
      : isOnStartStep
        ? 'Start'
        : 'Next';

  const currentFieldsValid = areStepFieldsValid(activeStep.index);

  return (
    <WizardContext.Provider value={contextValue}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-8 w-full"
        noValidate
      >
        <BaseCard className="max-sm:px-0 sm:px-2 py-4 overflow-clip">
          <div>
            <Stepper alternativeLabel={isSmallScreen}>
              {steps.map((step, index) => {
                if (!step.hidden) {
                  return (
                    <Step
                      key={step.label}
                      completed={index < activeStep.index}
                      active={index === activeStep.index}
                    >
                      <StepButton
                        color="inherit"
                        onClick={() => goToStep(index)}
                        disabled={
                          index - 1 > activeStep.index || isOnFinishStep
                        }
                      >
                        <StepLabel
                          className="cursor-pointer"
                          error={
                            !currentFieldsValid && index === activeStep.index
                          }
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
        <Panel className="shadow-lg overflow-clip">
          <div
            className="relative mb-4 transition-[height] duration-250 ease-in-out"
            style={mounting ? undefined : { height: `${formHeight}px` }}
          >
            {/* Hidden step for initial sizing */}
            <div className="invisible">
              <div className="mx-2">{steps[0]?.content}</div>
            </div>

            {steps.map((step, index) => {
              const isActive = activeStep.index === index;
              const direction =
                activeStep.previous !== undefined
                  ? activeStep.index > activeStep.previous
                    ? activeStep.index === index
                      ? 'left'
                      : 'right'
                    : activeStep.index === index
                      ? 'right'
                      : 'left'
                  : 'left';

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
                    <div className="mx-2">{step.content}</div>
                  </div>
                </Slide>
              );
            })}
          </div>
          <div className="flex flex-row justify-end items-center gap-2">
            <Button
              className={`normal-case ${isOnFinishStep ? 'invisible' : ''}`}
              loadingPosition="start"
              color="primary"
              onClick={goBack}
              disabled={activeStep.index === 0 || isOnFinishStep}
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

// Re-export for consumers that need wizard context
export { useWizardContext };
