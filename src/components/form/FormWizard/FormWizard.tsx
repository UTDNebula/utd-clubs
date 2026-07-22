'use client';

import WarningIcon from '@mui/icons-material/Warning';
import Button from '@mui/material/Button';
import Slide, { SlideProps } from '@mui/material/Slide';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnyFormGroupApi } from '@tanstack/react-form';
import {
  Children,
  isValidElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BaseCard } from '@nebula-library/components/BaseCard';
import Panel from '@nebula-library/components/Panel';
import { useAppForm, useFormContext } from '@src/utils/form';
import { TanstackSubscribe } from '@src/utils/Subscribe';
import { useIsMounted } from '@src/utils/useIsMounted';
import {
  FormWizardProps,
  FormWizardStepProps,
  StepState,
  StepStateConfig,
  WizardActionDispatcher,
  WizardStepConfig,
} from './types';
import { WizardContext } from './WizardContext';

/**
 * Reusable multi-step form wizard that integrates with TanStack Form.
 *
 * @example
 * const form = useAppForm({...})
 *
 * <form.Wizard onComplete={() => router.push('/')}>
 *   <form.WizardStep name="welcome" hidden >
 *     <h1>Welcome!</h1>
 *   </form.WizardStep>
 *   <form.WizardStep name="step1" label="Step 1" >
 *     ...Step 1 form fields...
 *   </form.WizardStep>
 *   <form.WizardStep name="step2" label="Step 2" >
 *     ...Step 2 form fields...
 *   </form.WizardStep>
 * </form.Wizard>
 */
export default function FormWizard({
  children,
  onComplete,
  hideStepper,
}: FormWizardProps) {
  const form = useFormContext() as unknown as ReturnType<typeof useAppForm>;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const LTR =
    typeof window !== 'undefined'
      ? window.getComputedStyle(document.documentElement).direction === 'ltr'
      : true;

  const steps = useMemo<WizardStepConfig[]>(
    () =>
      Children.toArray(children).flatMap((child) => {
        if (
          isValidElement(child) &&
          typeof child.type !== 'string' &&
          '_isWizardStep' in child.type
        ) {
          return [
            child.props as FormWizardStepProps & {
              children: ReactNode;
            },
          ];
        } else {
          return [];
        }
      }),
    [children],
  );

  const firstStepIndex = steps.findIndex(
    (step) => !step.disabled && !step.fake,
  );
  const defaultStepState: StepState = {
    current: {
      config: steps[firstStepIndex],
      index: firstStepIndex,
    },
    previous: undefined,
    furthest: {
      config: steps[firstStepIndex],
      index: firstStepIndex,
    },
  };

  const [stepState, setStepState] = useState<StepState>(defaultStepState);

  const setCurrentStep = useCallback(
    (value: React.SetStateAction<WizardStepConfig | undefined>) => {
      setStepState((prev) => {
        const config: WizardStepConfig | undefined =
          typeof value === 'function' ? value(prev.current.config) : value;
        const index = Math.max(
          steps.findIndex((step) => step.name === config?.name),
          0,
        );
        const newCurrent: StepStateConfig = { config, index };

        return {
          current: newCurrent,
          previous: prev.current,
          furthest:
            index > (prev.furthest.index ?? -1) ? newCurrent : prev.furthest,
        };
      });
    },
    [steps],
  );

  const groupApi = useRef<AnyFormGroupApi | undefined>(undefined);
  useEffect(() => {
    groupApi.current = form.formGroupApis
      .values()
      .toArray()
      .find((groupApi) => groupApi.name === stepState.current.config?.name);
  }, [form.formGroupApis, stepState]);

  const currentStep = stepState.current.config;

  const currentStepIndex = stepState.current.index;
  const previousStepIndex = stepState.previous?.index;
  const furthestStepIndex = stepState.furthest.index;

  const nextInaccessibleStepIndex = (() => {
    const index = steps
      .slice(currentStepIndex)
      .findIndex(
        (step) =>
          !step.disabled &&
          (step.nextButtonConfig?.disabled ||
            step.nextButtonConfig?.hidden ||
            step.nextButtonConfig?.type === 'submitAndNext'),
      );
    return index === -1 ? Infinity : index + currentStepIndex;
  })();
  const prevInaccessibleStepIndex = steps
    .slice(undefined, currentStepIndex + 1)
    .findLastIndex(
      (step) =>
        !step.disabled &&
        (step.backButtonConfig?.disabled || step.backButtonConfig?.hidden),
    );
  const nextFromFurthestEnabledStepIndex =
    steps
      .slice(furthestStepIndex + 1)
      .findIndex((step) => !step.disabled && !step.fake) +
    (furthestStepIndex + 1);

  const onFirstStep = currentStepIndex === firstStepIndex;
  const onLastStep = (() => {
    const index = steps.findLastIndex((step) => !step.disabled && !step.fake);
    return index === -1 ? true : currentStepIndex === index;
  })();

  if (steps[currentStepIndex]?.disabled && !steps[firstStepIndex]?.disabled) {
    setStepState(defaultStepState);
    console.error(
      `Returned to first step because step "${currentStep?.name}" at index ${currentStepIndex} was disabled while it was the active step. Please only disable a step once another step is active.`,
    );
  }

  // Dynamic height for absolutely-positioned step content
  const [formHeight, setFormHeight] = useState(0);
  const isMounted = useIsMounted();
  const observerRef = useRef<ResizeObserver | null>(null);

  const measureFormStepRef = useCallback((node: HTMLDivElement | null) => {
    // Disconnect previous observer when ref detaches (React calls with null)
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node !== null) {
      setFormHeight(node.clientHeight);

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) setFormHeight(entry.contentRect.height);
      });
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  const dispatchWizardAction: WizardActionDispatcher = useCallback(
    (action, options) => {
      // No navigation allowed while submitting form
      if (form.state.isSubmitting) return;

      const goNext = () => {
        if (!onLastStep) {
          const nextEnabledStep = steps
            .slice(currentStepIndex + 1)
            .find((step) => !step.disabled && !step.fake);
          if (nextEnabledStep) setCurrentStep(nextEnabledStep);
        } else {
          onComplete?.();
        }
      };
      const goBack = () => {
        if (!onFirstStep) {
          const prevEnabledStep = steps
            .slice(0, currentStepIndex)
            .findLast((step) => !step.disabled && !step.fake);
          if (prevEnabledStep) setCurrentStep(prevEnabledStep);
        }
      };
      const validateStep = async () => {
        const currentGroupApi = groupApi.current;
        if (!currentGroupApi) {
          console.error('Could not find currentGroupApi');
          throw new Error('Could not find currentGroupApi');
        }
        await currentGroupApi?.handleSubmit();
        if (currentGroupApi.state.meta.isSubmitSuccessful) {
          return true;
        } else {
          return false;
        }
      };

      switch (action) {
        case 'next':
          validateStep().then((isValid) => {
            if (isValid) {
              goNext();
            }
          });
          break;
        case 'back':
          if (!onFirstStep) {
            goBack();
          }
          break;
        case 'target':
          const targetStep = options?.targetStep;

          // Prevent targeting current step, disabled steps, or fake steps
          if (
            currentStep?.name !== targetStep?.name &&
            !targetStep?.disabled &&
            !targetStep?.fake
          ) {
            const targetStepIndex = steps.findIndex(
              (step) => step.name === targetStep?.name,
            );
            if (targetStepIndex < currentStepIndex) {
              setCurrentStep(targetStep);
            } else {
              // Prevent skipping if targeting a further step
              validateStep().then((isValid) => {
                if (isValid) {
                  setCurrentStep(targetStep);
                }
              });
            }
          }
          break;
        case 'submit':
          form.handleSubmit();
          break;
        case 'submitAndNext':
          form.handleSubmit().then(() => {
            if (form.state.isSubmitSuccessful) {
              goNext();
            }
          });
          break;
        case 'reset':
          form.reset();
          break;
        default:
          console.error(`Unknown wizard action "${action}"`);
      }
    },
    [
      currentStep?.name,
      currentStepIndex,
      form,
      onComplete,
      onFirstStep,
      onLastStep,
      setCurrentStep,
      steps,
    ],
  );

  const handleNextClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatchWizardAction(
      currentStep?.nextButtonConfig?.type ??
        (onLastStep ? 'submitAndNext' : 'next'),
    );
  };

  const handleBackClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatchWizardAction(currentStep?.backButtonConfig?.type ?? 'back');
  };

  const handleStepClick = (
    event: MouseEvent<HTMLButtonElement>,
    step: WizardStepConfig,
  ) => {
    event.preventDefault();
    dispatchWizardAction('target', { targetStep: step });
  };

  const contextValue = useMemo(
    () => ({
      dispatchWizardAction,
      stepState,
      steps,
      meta: {
        nextInaccessibleStepIndex,
        prevInaccessibleStepIndex,
        nextFromFurthestEnabledStepIndex,
        onFirstStep,
        onLastStep,
      },
    }),
    [
      dispatchWizardAction,
      stepState,
      steps,
      nextInaccessibleStepIndex,
      prevInaccessibleStepIndex,
      nextFromFurthestEnabledStepIndex,
      onFirstStep,
      onLastStep,
    ],
  );

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
        {!hideStepper && (
          <BaseCard className="overflow-clip py-4 max-sm:px-0 sm:px-2">
            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ isSubmitting }) => (
                <Stepper alternativeLabel={isSmallScreen}>
                  {steps.map((step, index) => {
                    if (step.disabled || step.hidden) return;

                    const isValid =
                      index > furthestStepIndex ||
                      (form.getFormGroupMeta(step.name)?.isValid ?? true);
                    const isCurrentStepValid =
                      form.getFormGroupMeta(currentStep?.name ?? '_unknown')
                        ?.isValid ?? true;

                    return (
                      <Step
                        key={step.label}
                        completed={index < currentStepIndex}
                        active={index === currentStepIndex}
                        disabled={
                          !isMounted ||
                          isSubmitting ||
                          step.fake || // Can't skip to fake steps
                          index > nextInaccessibleStepIndex || // Don't allow skipping forward if next button is disabled or hidden
                          index < prevInaccessibleStepIndex || // Don't allow skipping backward if back button is disabled or hidden
                          index > nextFromFurthestEnabledStepIndex || // Skip only to the (enabled) step directly after the furthest visited step
                          (!isCurrentStepValid && index > currentStepIndex) // If current step invalid, don't allow skipping forward
                        }
                      >
                        <StepButton
                          onClick={(e) => handleStepClick(e, step)}
                          icon={
                            isValid ? undefined : <WarningIcon color="error" />
                          }
                        >
                          <Typography
                            variant="inherit"
                            color={isValid ? 'inherit' : 'error'}
                          >
                            {step.label}
                          </Typography>
                        </StepButton>
                      </Step>
                    );
                  })}
                </Stepper>
              )}
            </form.Subscribe>
          </BaseCard>
        )}
        <Panel className="overflow-clip shadow-lg">
          <div
            className="relative mb-4 transition-[height] duration-250 ease-in-out"
            style={isMounted ? { height: `${formHeight}px` } : undefined}
          >
            {/* Hidden step for initial sizing */}
            {!isMounted && (
              <div className="invisible">
                <div className="mx-2">{steps[firstStepIndex]?.children}</div>
              </div>
            )}

            {steps.map((step, index) => {
              if (step.disabled || step.fake) return;

              const isActive = currentStepIndex === index;

              const fore = LTR ? 'left' : 'right';
              const aft = LTR ? 'right' : 'left';

              // Determines the direction of the slide transition
              const direction: SlideProps['direction'] =
                previousStepIndex !== undefined
                  ? currentStepIndex > previousStepIndex
                    ? // on next
                      currentStepIndex === index
                      ? fore // entering
                      : aft // exiting
                    : // on back
                      currentStepIndex === index
                      ? aft // entering
                      : fore // exiting
                  : // on mount
                    fore;

              return (
                <form.FormGroup
                  key={step.name}
                  name={step.name ?? step.label ?? `_unknown-${index}`}
                >
                  {() => (
                    <Slide
                      direction={direction}
                      timeout={250}
                      mountOnEnter
                      in={isActive}
                      className={`absolute top-0 ${LTR ? 'left-0' : 'right-0'} ${isMounted ? '' : 'invisible'}`}
                    >
                      <div ref={isActive ? measureFormStepRef : undefined}>
                        <div className="mx-2">{step.children}</div>
                      </div>
                    </Slide>
                  )}
                </form.FormGroup>
              );
            })}
          </div>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <TanstackSubscribe
                store={form.formGroupMetaDerived}
                selector={(state) =>
                  state[currentStep?.name ?? '_unknown']?.isValid ?? true
                }
              >
                {(isValid) => (
                  <div className="flex flex-row items-center justify-end gap-2">
                    <Button
                      className={`normal-case ${currentStep?.backButtonConfig?.hidden ? 'invisible' : ''}`}
                      disabled={
                        isSubmitting ||
                        currentStepIndex <= firstStepIndex ||
                        currentStep?.backButtonConfig?.disabled
                      }
                      color="primary"
                      onClick={handleBackClick}
                    >
                      {currentStep?.backButtonConfig?.label ?? 'Back'}
                    </Button>
                    <Button
                      variant="contained"
                      className={`normal-case ${currentStep?.nextButtonConfig?.hidden ? 'invisible' : ''}`}
                      disabled={
                        !isValid || currentStep?.nextButtonConfig?.disabled
                      }
                      loading={isSubmitting}
                      loadingPosition="start"
                      color="primary"
                      onClick={handleNextClick}
                    >
                      {currentStep?.nextButtonConfig?.label ??
                        (onLastStep ? 'Submit' : 'Next')}
                    </Button>
                  </div>
                )}
              </TanstackSubscribe>
            )}
          </form.Subscribe>
        </Panel>
      </form>
    </WizardContext.Provider>
  );
}
