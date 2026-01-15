'use client';

import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/system/useMediaQuery';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useState } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import Panel from '@src/components/common/Panel';
import { SelectUserMetadataWithClubs } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import {
  accountOnboardingSchema,
  AccountOnboardingSchema,
} from '@src/utils/formSchemas';
import FormStep, { StepObject } from './FormStep';

export const steps: StepObject[] = [
  { id: 0, label: 'Get Started' },
  { id: 1, label: 'Name' },
  { id: 2, label: 'College Info' },
  { id: 3, label: 'Contact Email' },
  { id: 4, label: 'Finish', hidden: true },
];

type OnboardingFormProps = {
  userMetadata?: SelectUserMetadataWithClubs;
  /**
   * Include div's for centering and keeping content within a max width
   */
  withLayout?: boolean;
};

export default function OnboardingForm({
  userMetadata,
  withLayout = false,
}: OnboardingFormProps) {
  const router = useRouter();

  const theme = useTheme();

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

          setActiveStep((prev) => ({
            current: steps.length - 1,
            previous: prev.current,
          }));

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

  const [activeStep, setActiveStep] = useState({
    current: 0,
    previous: undefined as number | undefined,
  });

  // State that indicates the page is still loading, so temporarily hide everything
  const [mounting, setMounting] = useState(true);

  // Because form steps are positioned absolutely on top of one another, they do
  // not affect the document flow and thus the height of the parent does not
  // adjust to the different height of steps.
  // This variable is determined by the height of the active step, and is used
  // to set the height of its parent.
  const [formHeight, setFormHeight] = useState(0);

  // Ref that refers to the component for the active step
  const measureFormStepRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      // Permanently removes the flag that the page is still loading
      // Ideally, this would go in another location, but here works fine for now
      setMounting(false);

      const height = node.clientHeight;
      setFormHeight(height);

      // As user interacts with the form, the height of the component may change naturally.
      // Thus, the parent height will need to be adjusted whenever the active step
      // component changes size.
      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setFormHeight(entry.contentRect.height);
        });
      });

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    if (activeStep.current < steps.length - 2) {
      // Prevents submit button from activating prematurely when navigating
      // from the penultimate step to the last step
      event.preventDefault();
      setActiveStep((prev) => ({
        current: prev.current + 1,
        previous: prev.current,
      }));
    } else if (activeStep.current === steps.length - 1) {
      // When user clicks Continue button on success screen
      router.push('/');
    }
  };

  const handleBack = () => {
    if (activeStep.current > 0) {
      setActiveStep((prev) => ({
        current: prev.current - 1,
        previous: prev.current,
      }));
    }
  };

  const BackButton = (
    <Button
      className={`normal-case ${activeStep.current === steps.length - 1 ? 'invisible' : ''}`}
      loadingPosition="start"
      color="primary"
      onClick={handleBack}
      disabled={
        activeStep.current === 0 || activeStep.current === steps.length - 1
      }
    >
      Back
    </Button>
  );

  const NextButton = (
    <Button
      type={activeStep.current === steps.length - 2 ? 'submit' : undefined}
      variant="contained"
      className="normal-case"
      disabled={activeStep.current === steps.length - 2 && !form.state.isValid}
      loading={form.state.isSubmitting}
      loadingPosition="start"
      color={
        activeStep.current === steps.length - 2 && !form.state.isValid
          ? 'inherit'
          : 'primary'
      }
      onClick={handleNext}
    >
      {activeStep.current < steps.length - 2
        ? activeStep.current === 0
          ? 'Start'
          : 'Next'
        : activeStep.current !== steps.length - 1
          ? 'Submit'
          : 'Continue'}
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
      noValidate
    >
      <BaseCard className="max-sm:px-0 sm:px-2 py-4 overflow-clip">
        <div>
          <Stepper
            alternativeLabel={useMediaQuery(theme.breakpoints.down('sm'))}
          >
            {steps
              .filter((ele) => !ele.hidden)
              .map((step, index) => (
                <Step
                  key={step.label}
                  completed={index < activeStep.current}
                  active={index === activeStep.current}
                >
                  <StepButton
                    color="inherit"
                    onClick={() => {
                      setActiveStep((prev) => ({
                        current: index,
                        previous: prev.current,
                      }));
                    }}
                    disabled={
                      index - 1 > activeStep.current ||
                      activeStep.current === steps.length - 1
                    }
                  >
                    {step.label}
                  </StepButton>
                </Step>
              ))}
          </Stepper>
        </div>
      </BaseCard>
      <Panel className="shadow-lg overflow-clip">
        <div
          className="relative mb-4 transition-[height] duration-250 ease-in-out"
          style={
            // Only programmatically set the height once everything has loaded
            mounting
              ? undefined
              : {
                  height: `${formHeight}px`,
                }
          }
        >
          {/* Hidden step component used only to correctly size the parent when the page loads */}
          <div className="invisible">
            <FormStep form={form} step={steps[0]} active={false} />
          </div>

          {steps.map((step, index) => {
            const stepNumber = steps.findIndex(
              (searchStep) => searchStep.id === step.id,
            );

            const isActive = activeStep.current === stepNumber;

            // Determines the direction of the slide transition
            const direction =
              activeStep.previous !== undefined
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
                  <FormStep form={form} step={step} active={isActive} />
                </div>
              </Slide>
            );
          })}
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          {BackButton}
          {NextButton}
        </div>
      </Panel>
    </form>
  );

  return withLayout ? (
    <div className="flex w-full flex-col items-center p-4">
      <div className="w-full max-w-6xl">{OnboardingFormElement}</div>
    </div>
  ) : (
    <>{OnboardingFormElement}</>
  );
}
