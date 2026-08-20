'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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

export type ClubMatchFormProps = {
  response?: ClubMatchResponses | null;
  userMetadata?: SelectUserMetadata | null;
};

export const ClubMatchForm = ({
  response,
  userMetadata,
}: ClubMatchFormProps) => {
  const api = useTRPC();
  const router = useRouter();

  const editData = useMutation(api.ai.clubMatch.mutationOptions({}));

  const form = useAppForm({
    defaultValues: {
      collegeInfo: {
        major: userMetadata?.major,
        ...response,
      },
      interests: {
        ...response,
      },
      involvement: {
        ...response,
      },
    } as ClubMatchWizardSchema,
    onSubmit: async ({ value }) => {
      if (!editData.isPending) {
        await editData.mutateAsync({
          ...value.collegeInfo,
          ...value.interests,
          ...value.involvement,
        });
        router.push('/club-match/results');
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
          router.push('/club-match/results');
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
