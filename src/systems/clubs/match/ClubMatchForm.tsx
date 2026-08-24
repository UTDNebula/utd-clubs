'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { setSnackbar, SnackbarPresets } from '@/lib/modules/snackbar';
import { useAppForm } from '@/lib/utils/form';
import { SelectUserMetadata } from '@/server/db/models';
import { ClubMatchResponses } from '@/server/db/schema/users';
import { useTRPC } from '@/trpc/react';
import {
  clubMatchWizardSchema,
  ClubMatchWizardSchema,
} from './clubMatchSchema';
import CollegeInfoStep from './steps/CollegeInfoStep';
import InterestsStep from './steps/InterestsStep';
import InvolvementStep from './steps/InvolvementStep';
import { Binoculars } from '@/lib/icons/OtherIcons';

export const ClubMatchForm = ({
  response,
  userMetadata,
}: {
  response?: ClubMatchResponses | null;
  userMetadata?: SelectUserMetadata | null;
}) => {
  const api = useTRPC();
  const router = useRouter();

  const editData = useMutation(
    api.ai.clubMatch.mutationOptions({
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorWithMessage(
            error.message ||
              'Failed to generate club recommendations. Please try again.',
          ),
        );
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      collegeInfo: {
        major: userMetadata?.major ?? response?.major ?? '',
        year: response?.year ?? '',
        proximity: response?.proximity ?? '',
      },
      interests: {
        categories: response?.categories ?? [],
        specificCultures: response?.specificCultures ?? '',
        hobbies: response?.hobbies ?? [],
        hobbyDetails: response?.hobbyDetails ?? '',
        otherAcademicInterests: response?.otherAcademicInterests ?? '',
        newExperiences: response?.newExperiences ?? '',
      },
      involvement: {
        involvementGoals: response?.involvementGoals ?? [],
        skills: response?.skills ?? [],
        gender: response?.gender ?? '',
        genderOther: response?.genderOther ?? '',
        timeCommitment: response?.timeCommitment ?? '',
      },
    } as ClubMatchWizardSchema,
    onSubmit: async ({ value }) => {
      if (!editData.isPending) {
        await editData.mutateAsync({
          ...value.collegeInfo,
          ...value.interests,
          ...value.involvement,
          genderOther:
            value.involvement.gender === 'Other'
              ? value.involvement.genderOther
              : undefined, // Remove old "genderOther" value when gender is not "Other"
        });
      }
    },
    validators: {
      onChange: clubMatchWizardSchema,
    },
  });

  return (
    <form.AppForm>
      <form.Wizard
        onComplete={() => {
          router.push('/club-match');
        }}
      >
        <form.WizardStep<ClubMatchWizardSchema>
          name="collegeInfo"
          label="College Info"
          backButtonConfig={{
            label: 'Cancel',
            onClick: () => {
              router.back();
            },
          }}
        >
          <CollegeInfoStep form={form} />
        </form.WizardStep>

        <form.WizardStep<ClubMatchWizardSchema>
          name="interests"
          label="Interests"
        >
          <InterestsStep form={form} />
        </form.WizardStep>

        <form.WizardStep<ClubMatchWizardSchema>
          name="involvement"
          label="Involvement"
          nextButtonConfig={{
            label: 'Find Clubs',
            icon: <Binoculars />,
            type: 'submitAndNext',
          }}
        >
          <InvolvementStep form={form} />
        </form.WizardStep>
      </form.Wizard>
    </form.AppForm>
  );
};

export default ClubMatchForm;
