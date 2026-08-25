'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { BaseCard } from '@nebula-library/components/BaseCard';
import { Binoculars } from '@/lib/icons/OtherIcons';
import StartClubMatchButton from '@/systems/clubs/match/StartClubMatchButton';

export const ClubMatchAdDismissedOnStorageKey = 'ClubMatchAdDismissedOn';

export default function ClubMatchAdCard({
  setDismissed,
}: {
  setDismissed?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <BaseCard
      variant="interactive"
      className="bg-cornflower-100 dark:bg-cornflower-900 relative flex h-full min-h-[400px] max-w-xs min-w-[300px] flex-col justify-between p-6 md:min-h-[600px]"
    >
      <Link
        href={`/club-match`}
        className="ClubMatchAdCardLink absolute inset-0 z-10"
      />

      <div className="flex aspect-square w-full items-center justify-center">
        <Binoculars className="text-8xl opacity-50" />
      </div>
      <div className="flex flex-col gap-6">
        <p className="line-clamp-2 text-xl font-medium text-slate-800 dark:text-slate-200">
          Club Match
        </p>
        <p>
          Want to quickly find clubs that match your hobbies and interests? Take
          this quiz and get intelligently matched with student organizations at
          UTD that you may find interesting!
        </p>
        <StartClubMatchButton className="z-20" />
        {setDismissed && (
          <Button
            size="large"
            color="inherit"
            className="z-20"
            onClick={() => {
              window.localStorage.setItem(
                ClubMatchAdDismissedOnStorageKey,
                new Date().toISOString(),
              );
              setDismissed(true);
            }}
          >
            Dismiss
          </Button>
        )}
      </div>
    </BaseCard>
  );
}
