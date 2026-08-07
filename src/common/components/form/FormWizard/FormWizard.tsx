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
  forwardRef,
  isValidElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BaseCard } from '@nebula-library/components/BaseCard';
import Panel from '@nebula-library/components/Panel';
import { useAppForm, useFormContext } from '@src/common/utils/form';
import { TanstackSubscribe } from '@src/common/utils/Subscribe';
import { useIsMounted } from '@src/common/utils/useIsMounted';
import {
  FormWizardProps,
  FormWizardStepProps,
  StepState,
  StepStateItem,
  WizardActionDispatcher,
  WizardContextType,
  WizardRef,
  WizardStepConfig,
} from './types';
import WizardContext from './WizardContext';

/**
 * Reusable multi-step form wizard that integrates with TanStack Form.
 *
 * Must have `<FormWizardStep />` components as direct descendants.
 *
 * @example
 * const form = useAppForm({...})
 *
 * <form.Wizard onComplete={() => router.push('/')}>
 *   <form.WizardStep name="welcome" hidden>
 *     <h1>Welcome!</h1>
 *   </form.WizardStep>
 *   <form.WizardStep name="step1" label="Step 1">
 *     ...Step 1 form fields...
 *   </form.WizardStep>
 *   <form.WizardStep name="step2" label="Step 2">
 *     ...Step 2 form fields...
 *   </form.WizardStep>
 * </form.Wizard>
 */
const FormWizard = forwardRef<WizardRef, FormWizardProps>(function FormWizard(
  { children, onComplete, hideStepper },
  ref,
) {
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
          console.error(
            `Invalid child ${isValidElement(child) ? `"${child.type}" ` : ''}in FormWizard. ` +
              'Only FormWizardSteps can be direct descendants of FormWizard.',
          );
          return [];
        }
      }),
    [children],
  );

  const firstStepIndex = steps.findIndex(
    (step) => !step.disabled && !step.fake,
  );
  const defaultStepState: StepState = useMemo(
    () => ({
      current: {
        config: steps[firstStepIndex],
        index: firstStepIndex,
      },
      previous: undefined,
      furthest: {
        config: steps[firstStepIndex],
        index: firstStepIndex,
      },
    }),
    [firstStepIndex, steps],
  );

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
        const newCurrent: StepStateItem = { config, index };

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

  /**
   * Index of the furthest future step that is accessible. This means:
   *
   * - User is allowed to advance up to this step
   * - Step isn't disabled
   * - The step right before doesn't require submitting the form first
   * - The next button for the step right before isn't disabled or hidden
   *
   * This does NOT check if steps are valid; you should also use {@linkcode earliestInvalidStepIndex}.
   */
  const latestAccessibleStepIndex = (() => {
    if (currentStep?.noAdvance) return currentStepIndex;
    const index = steps
      .slice(currentStepIndex)
      .findIndex(
        (step) =>
          !step.disabled &&
          (step.nextButtonConfig?.disabled ||
            step.nextButtonConfig?.hidden ||
            step.nextButtonConfig?.type === 'submit' ||
            step.nextButtonConfig?.type === 'submitAndNext'),
      );
    return index === -1 ? Infinity : index + currentStepIndex;
  })();

  /**
   * Index of the earliest past step that is accessible. This means:
   * - User is allowed to backtrack up to this step
   * - Step isn't disabled
   * - The back button for the step right after isn't disabled or hidden
   */
  const earliestAccessibleStepIndex = currentStep?.noBacktrack
    ? currentStepIndex
    : steps
        .slice(undefined, currentStepIndex + 1)
        .findLastIndex(
          (step) =>
            !step.disabled &&
            (step.backButtonConfig?.disabled || step.backButtonConfig?.hidden),
        );

  /**
   * Index of the step right after the furthest step that isn't disabled or fake.
   */
  const nextEnabledAfterFurthestStepIndex =
    steps
      .slice(furthestStepIndex + 1)
      .findIndex((step) => !step.disabled && !step.fake) +
    (furthestStepIndex + 1);

  /**
   * Index of the first step that is invalid.
   */
  const earliestInvalidStepIndex = form.state.isValid
    ? Infinity
    : steps.findIndex(
        (step) => !(form.getFormGroupMeta(step.name)?.isValid ?? true),
      );

  /**
   * Whether currently on the first step that isn't disabled or fake.
   */
  const onFirstStep = currentStepIndex === firstStepIndex;

  /**
   * Whether currently on the last step that isn't disabled or fake.
   */
  const onLastStep = (() => {
    const index = steps.findLastIndex((step) => !step.disabled && !step.fake);
    return index === -1 ? true : currentStepIndex === index;
  })();

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
    async (action, options) => {
      const noValidate = options?.noValidate;
      const allowDisabled = options?.allowDisabled;

      // No navigation allowed while submitting form
      if (form.state.isSubmitting && !noValidate) return false;

      const goNext = async (): Promise<boolean> => {
        if (!onLastStep && !currentStep?.noAdvance) {
          const nextEnabledStep = steps
            .slice(currentStepIndex + 1)
            .find((step) => (!step.disabled || allowDisabled) && !step.fake);
          if (!nextEnabledStep) return false;
          setCurrentStep(nextEnabledStep);
          return true;
        } else {
          onComplete?.();
          return true;
        }
      };
      const goBack = async (): Promise<boolean> => {
        if (!onFirstStep && !currentStep?.noBacktrack) {
          const prevEnabledStep = steps
            .slice(0, currentStepIndex)
            .findLast(
              (step) => (!step.disabled || allowDisabled) && !step.fake,
            );
          if (!prevEnabledStep) return false;
          setCurrentStep(prevEnabledStep);
          return true;
        }
        return false;
      };
      const goToTargetStep = async (): Promise<boolean> => {
        const targetStep: WizardStepConfig | undefined =
          typeof options?.targetStep === 'string'
            ? steps.find((step) => step.name === options?.targetStep)
            : options?.targetStep;

        // Prevent targeting current step, disabled steps (unless allowDisabled), or fake steps
        if (
          currentStep?.name === targetStep?.name ||
          (targetStep?.disabled && !allowDisabled) ||
          targetStep?.fake
        )
          return false;

        const targetStepIndex = steps.findIndex(
          (step) => step.name === targetStep?.name,
        );

        if (targetStepIndex > currentStepIndex && !currentStep?.noAdvance) {
          const isValid = await validateStep();
          if (isValid) {
            setCurrentStep(targetStep);
            return true;
          }
        } else if (
          targetStepIndex < currentStepIndex &&
          !currentStep?.noBacktrack
        ) {
          setCurrentStep(targetStep);
          return true;
        }
        return false;
      };
      const validateStep = async (): Promise<boolean> => {
        if (noValidate) return true;

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
      const restart = (): boolean => {
        // Set previousIndex to Infinity so transition slides in correct direction
        setStepState({ ...defaultStepState, previous: { index: Infinity } });
        return true;
      };

      switch (action) {
        case 'none':
          return true;
        case 'next':
          const isValid = await validateStep();
          if (isValid) return goNext();
          return false;
        case 'back':
          if (!onFirstStep) goBack();
          return false;
        case 'target':
          return goToTargetStep();
        case 'submit':
          await form.handleSubmit();
          if (form.state.isSubmitSuccessful) {
            return true;
          }
          return false;
        case 'submitAndNext':
          await form.handleSubmit();
          if (form.state.isSubmitSuccessful) {
            return goNext();
          }
          return false;
        case 'reset':
          form.reset();
          return restart();
        case 'restart':
          return restart();
        default:
          console.error(`Unknown wizard action "${action}"`);
          return false;
      }
    },
    [
      currentStep?.name,
      currentStep?.noAdvance,
      currentStep?.noBacktrack,
      currentStepIndex,
      defaultStepState,
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
    currentStep?.nextButtonConfig?.onClick?.(event);
    dispatchWizardAction(
      currentStep?.nextButtonConfig?.type ??
        (onLastStep ? 'submitAndNext' : 'next'),
      {
        targetStep: currentStep?.nextButtonConfig?.targetStepName,
      },
    );
  };

  const handleBackClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    currentStep?.backButtonConfig?.onClick?.(event);
    dispatchWizardAction(currentStep?.backButtonConfig?.type ?? 'back', {
      targetStep: currentStep?.backButtonConfig?.targetStepName,
    });
  };

  const handleStepClick = (
    event: MouseEvent<HTMLButtonElement>,
    step: WizardStepConfig,
  ) => {
    event.preventDefault();
    step.onStepperClick?.(event);
    dispatchWizardAction('target', { targetStep: step });
  };

  const contextValue = useMemo<WizardContextType>(
    () => ({
      dispatchWizardAction,
      stepState,
      steps,
      meta: {
        latestAccessibleStepIndex,
        earliestAccessibleStepIndex,
        nextEnabledAfterFurthestStepIndex,
        earliestInvalidStepIndex,
        onFirstStep,
        onLastStep,
      },
    }),
    [
      dispatchWizardAction,
      stepState,
      steps,
      latestAccessibleStepIndex,
      earliestAccessibleStepIndex,
      nextEnabledAfterFurthestStepIndex,
      earliestInvalidStepIndex,
      onFirstStep,
      onLastStep,
    ],
  );

  useImperativeHandle(ref, () => {
    return contextValue;
  }, [contextValue]);

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
                    const isDisabled = Boolean(
                      !isMounted ||
                      isSubmitting ||
                      (step.fake && !step.onStepperClick) || // Can't skip to fake steps. Enable just for onStepperClick functionality
                      index > latestAccessibleStepIndex || // Don't allow skipping forward if next button is disabled or hidden
                      index < earliestAccessibleStepIndex || // Don't allow skipping backward if back button is disabled or hidden
                      index > nextEnabledAfterFurthestStepIndex || // Skip only to the (enabled) step directly after the furthest visited step
                      index > earliestInvalidStepIndex, // Don't allow skipping forward past invalid steps
                    );

                    return (
                      <Step
                        key={step.label}
                        completed={index < currentStepIndex}
                        active={index === currentStepIndex}
                        disabled={isDisabled}
                      >
                        <StepButton
                          onClick={(e) => handleStepClick(e, step)}
                          icon={
                            isValid ? undefined : <WarningIcon color="error" />
                          }
                          aria-controls="form-wizard-content"
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
        <Panel className="overflow-clip shadow-lg" id="form-wizard-content">
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
              // Don't mount if disabled (unless absolutely necessary) or fake
              if ((step.disabled && currentStepIndex !== index) || step.fake)
                return;

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
                      className={`absolute inset-x-0 top-0 ${isMounted ? '' : 'invisible'}`}
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
                      disabled={(() => {
                        // Don't disable if user configures event handler or explicitly sets disable to false
                        const userAllowedConditions =
                          currentStep?.backButtonConfig?.disabled !== false &&
                          !currentStep?.backButtonConfig?.onClick;

                        // Conditions enabled only if userAllowedConditions is false
                        const conditionalConditions =
                          currentStepIndex <= firstStepIndex ||
                          currentStep?.noBacktrack;

                        return Boolean(
                          isSubmitting ||
                          currentStep?.backButtonConfig?.disabled ||
                          (userAllowedConditions && conditionalConditions),
                        );
                      })()}
                      color="primary"
                      onClick={handleBackClick}
                    >
                      {currentStep?.backButtonConfig?.label ?? 'Back'}
                    </Button>
                    <Button
                      variant="contained"
                      className={`normal-case ${currentStep?.nextButtonConfig?.hidden ? 'invisible' : ''}`}
                      disabled={(() => {
                        // Don't disable if user configures event handler or explicitly sets disable to false
                        const userAllowedConditions =
                          currentStep?.nextButtonConfig?.disabled !== false &&
                          !currentStep?.nextButtonConfig?.onClick;

                        // Conditions enabled only if userAllowedConditions is false
                        const conditionalConditions =
                          !isValid || currentStep?.noAdvance;

                        return Boolean(
                          currentStep?.nextButtonConfig?.disabled ||
                          (userAllowedConditions && conditionalConditions),
                        );
                      })()}
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
});

export default FormWizard;
