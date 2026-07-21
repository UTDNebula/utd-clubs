'use client';

import Button from '@mui/material/Button';
import Slide, { SlideProps } from '@mui/material/Slide';
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
import {
  FormWizardProps,
  FormWizardStepProps,
  StepState,
  StepStateConfig,
  WizardAction,
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
    window.getComputedStyle(document.documentElement).direction === 'ltr';

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

  const firstEnabledStep = steps.find((step) => !step.disabled);
  const defaultStepState: StepState = {
    current: { config: firstEnabledStep, index: 0 },
    previous: undefined,
    furthest: { config: firstEnabledStep, index: 0 },
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

  const currentStep = stepState.current.config;
  const previousStep = stepState.previous?.config;
  const furthestStep = stepState.furthest.config;

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
    steps.slice(furthestStepIndex + 1).findIndex((step) => !step.disabled) +
    (furthestStepIndex + 1);

  const onFirstStep = currentStepIndex === 0;
  const onLastStep = (() => {
    const index = steps.findLastIndex((step) => !step.disabled);
    return index === -1 ? true : currentStepIndex === index;
  })();

  if (steps[currentStepIndex]?.disabled && !steps[0]?.disabled) {
    setStepState(defaultStepState);
    console.error(
      `Returned to first step because step "${currentStep?.name}" at index ${currentStepIndex} was disabled while it was the active step. Please only disable a step once another step is active.`,
    );
  }

  // Dynamic height for absolutely-positioned step content
  const [formHeight, setFormHeight] = useState(0);
  const [mounting, setMounting] = useState(true);
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

  const dispatchWizardAction = useCallback(
    (action: WizardAction, options?: { targetStep?: WizardStepConfig }) => {
      // No navigation allowed while submitting form
      if (form.state.isSubmitting) return;

      const goNext = () => {
        if (!onLastStep) {
          const nextEnabledStep = steps
            .slice(currentStepIndex + 1)
            .find((step) => !step.disabled);
          setCurrentStep(nextEnabledStep);
        } else {
          onComplete?.();
        }
      };
      const goBack = () => {
        if (!onFirstStep) {
          const prevEnabledStep = steps
            .slice(0, currentStepIndex)
            .findLast((step) => !step.disabled);
          setCurrentStep(prevEnabledStep);
        }
      };

      switch (action) {
        case 'next':
          goNext();
          break;
        case 'back':
          if (!onFirstStep) {
            goBack();
          }
          break;
        case 'target':
          if (currentStep?.name !== options?.targetStep?.name) {
            setCurrentStep(options?.targetStep);
          }
          break;
        case 'submit':
          form.handleSubmit();
          break;
        case 'submitAndNext':
          form.handleSubmit().then(() => {
            // Only advance to next step if submission handled successfully
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

  // Context value
  // const contextValue = useMemo(
  //   () => ({
  //     activeStep: activeStepIndex,
  //     previousStep: previousStepIndex,
  //     steps,
  //     goNext,
  //     goBack,
  //     goToStep,
  //     goToFinish,
  //   }),
  //   [
  //     activeStepIndex,
  //     previousStepIndex,
  //     steps,
  //     goNext,
  //     goBack,
  //     goToStep,
  //     goToFinish,
  //   ],
  // );

  const currentFieldsValid = true;

  const formGroupApis = form.formGroupApis.values().toArray();

  return (
    // <WizardContext.Provider value={contextValue}>
    <WizardContext.Provider
      value={{
        activeStep: 0,
        previousStep: undefined,
        steps: [],
        goNext: () => {},
        goBack: () => {},
        goToStep: () => {},
        goToFinish: () => {},
      }}
    >
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
              console.log('currentStep:', currentStepIndex, currentStep);
              console.log('previousStep:', previousStepIndex, previousStep);
              console.log('furthestStep:', furthestStepIndex, furthestStep);
            }}
          >
            Log state
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
            Log submission
          </Button>
        </div>

        {!hideStepper && (
          <BaseCard className="overflow-clip py-4 max-sm:px-0 sm:px-2">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Stepper alternativeLabel={isSmallScreen}>
                  {steps.map((step, index) => {
                    if (step.disabled || step.hidden) return;

                    return (
                      <Step
                        key={step.label}
                        completed={index < currentStepIndex}
                        active={index === currentStepIndex}
                      >
                        <StepButton
                          color="inherit"
                          onClick={(e) => handleStepClick(e, step)}
                          disabled={
                            isSubmitting ||
                            index > nextInaccessibleStepIndex || // Don't allow skipping forward if next button is disabled or hidden
                            index < prevInaccessibleStepIndex || // Don't allow skipping backward if back button is disabled or hidden
                            index > nextFromFurthestEnabledStepIndex // Skip only to the (enabled) step directly after the furthest visited step
                            // (!currentFieldsValid && index >= currentStepIndex)
                          }
                        >
                          <StepLabel
                            className="cursor-pointer"
                            // error={
                            //   !currentFieldsValid && index === currentStepIndex
                            // }
                          >
                            {step.label}
                          </StepLabel>
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
            style={mounting ? undefined : { height: `${formHeight}px` }}
          >
            {/* Hidden step for initial sizing */}
            {mounting && (
              <div className="invisible">
                <div className="mx-2">{steps[0]?.children}</div>
              </div>
            )}

            {steps.map((step, index) => {
              if (step.disabled) return;

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
                <Slide
                  key={step.name}
                  direction={direction}
                  timeout={250}
                  mountOnEnter
                  unmountOnExit
                  in={isActive}
                  className={`absolute top-0 ${LTR ? 'left-0' : 'right-0'} ${mounting ? 'invisible' : ''}`}
                >
                  <div ref={isActive ? measureFormStepRef : undefined}>
                    <div className="mx-2">
                      <form.FormGroup
                        name={step.name ?? step.label ?? `_unknown-${index}`}
                      >
                        {() => <>{step.children}</>}
                      </form.FormGroup>
                    </div>
                  </div>
                </Slide>
              );
            })}
          </div>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <div className="flex flex-row items-center justify-end gap-2">
                <Button
                  className={`normal-case ${currentStep?.backButtonConfig?.hidden ? 'invisible' : ''}`}
                  disabled={
                    isSubmitting ||
                    currentStepIndex <= 0 ||
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
                    !currentFieldsValid ||
                    currentStep?.nextButtonConfig?.disabled
                  }
                  loading={isSubmitting}
                  loadingPosition="start"
                  color={!currentFieldsValid ? 'inherit' : 'primary'}
                  onClick={handleNextClick}
                >
                  {currentStep?.nextButtonConfig?.label ??
                    (onLastStep ? 'Submit' : 'Next')}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </Panel>
      </form>
    </WizardContext.Provider>
  );
}
