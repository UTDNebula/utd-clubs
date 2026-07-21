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
export default function FormWizard({ onComplete, children }: FormWizardProps) {
  const form = useFormContext() as unknown as ReturnType<typeof useAppForm>;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const defaultStepState = {
    current: { config: steps[0], index: 0 },
    previous: undefined,
  };

  const [stepState, setStepState] = useState<StepState>(defaultStepState);

  const setCurrentStep = useCallback(
    (value: React.SetStateAction<WizardStepConfig | undefined>) => {
      setStepState((prev) => {
        const config =
          typeof value === 'function' ? value(prev.current?.config) : value;
        return {
          current: {
            config,
            index: steps.findIndex((step) => step.name === config?.name),
          },
          previous: prev.current,
        };
      });
    },
    [steps],
  );

  // Handle edge cases due to programmatically adding or removing a step, or because of unknown step.
  // Without these checks, the form could skip to the next step, which could be undesirable depending on how the form is structured.
  const findStepIndex = steps.findIndex(
    (step) => step.name === stepState.current?.config?.name,
  );
  if (findStepIndex === -1) {
    // If unknown step, return to first step
    if (steps.length > 0) {
      setStepState(defaultStepState);
      console.error(
        `Returned to first step because of unknown step "${stepState.current.config?.name}" at index ${stepState.current.index}. This can happen if:\n\n- Tried switching to a step with an unknown name\n- This wizard step was removed while it was the active step. Please only remove a step once another step is active.`,
      );
    }
  } else if (findStepIndex !== stepState.current.index) {
    // An earlier step was added or removed, so adjust state's step index
    console.log('non matching edge case');
    setStepState((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        index: findStepIndex,
      },
    }));
  }

  const currentStep = stepState.current?.config;
  const previousStep = stepState.previous?.config;

  const currentStepIndex = stepState.current.index;
  const previousStepIndex = stepState.previous?.index;

  const onFirstStep = currentStepIndex === 0;
  const onLastStep = currentStepIndex === steps.length - 1;

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

      switch (action) {
        case 'next':
          if (!onLastStep) {
            setCurrentStep(steps[currentStepIndex + 1]);
          } else {
            onComplete?.();
          }
          break;
        case 'back':
          if (!onFirstStep) {
            setCurrentStep(steps[currentStepIndex - 1]);
          }
          break;
        case 'target':
          setCurrentStep(options?.targetStep);
          break;
        case 'submit':
          form.handleSubmit();
          break;
        case 'submitAndNext':
          form.handleSubmit().then(() => {
            // Only advance to next step if submission handled successfully
            if (form.state.isSubmitSuccessful) {
              if (!onLastStep) {
                setCurrentStep(steps[currentStepIndex + 1]);
              } else {
                onComplete?.();
              }
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
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Stepper alternativeLabel={isSmallScreen}>
                {steps.map((step, index) => {
                  if (!step.hidden) {
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
                            index - 1 > currentStepIndex ||
                            // isOnFinishStep ||
                            (!currentFieldsValid && index >= currentStepIndex)
                          }
                        >
                          <StepLabel
                            className="cursor-pointer"
                            error={
                              !currentFieldsValid && index === currentStepIndex
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
            )}
          </form.Subscribe>
        </BaseCard>
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
              const isActive = currentStepIndex === index;

              // Determines the direction of the slide transition
              const direction: SlideProps['direction'] =
                previousStepIndex !== undefined
                  ? currentStepIndex > previousStepIndex
                    ? // on next
                      currentStepIndex === index
                      ? 'left' // entering
                      : 'right' // exiting
                    : // on back
                      currentStepIndex === index
                      ? 'right' // entering
                      : 'left' // exiting
                  : // on mount
                    'left';

              return (
                <Slide
                  key={step.name}
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
                  className="normal-case"
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
