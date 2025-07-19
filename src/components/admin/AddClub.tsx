'use client';

import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import ClubSearch from './ClubSearch';
import 'react-day-picker/dist/style.css';
import { useTRPC } from '@src/trpc/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddClub = {
  range: DateRange;
  orgId: string | null;
  name: string | null;
};

export default function AddClub() {
  const [addClub, setAddClub] = useState<AddClub>({
    range: { from: undefined, to: undefined },
    orgId: null,
    name: null,
  });
  const router = useRouter();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    api.admin.addClubCarousel.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          api.admin.upcomingCarousels.queryOptions(),
        );
        await queryClient.invalidateQueries(
          api.club.getCarousel.queryOptions(),
        );
        await queryClient.refetchQueries(
          api.admin.upcomingCarousels.queryOptions(),
        );
        await queryClient.refetchQueries(api.club.getCarousel.queryOptions());
        router.push('/admin/carousel');
      },
    }),
  );

  function onClick() {
    if (!addClub.orgId || !addClub.range.from || !addClub.range.to) return;

    mutate({
      orgId: addClub.orgId,
      range: addClub.range,
    });
  }

  function setClub({ id, name }: { id: string; name: string }) {
    setAddClub({ ...addClub, orgId: id, name });
  }

  function setRange(range: DateRange | undefined) {
    setAddClub({
      ...addClub,
      range: {
        from: range?.from ? range.from : undefined,
        to: range?.to ? range.to : undefined,
      },
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-8 shadow-lg">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full">
          <ClubSearch setClub={setClub} />
          {addClub.name && (
            <div className="text-2xl font-semibold text-gray-800">
              Adding {addClub.name}
            </div>
          )}
          {addClub.range.from && addClub.range.to && (
            <div className="flex flex-col space-y-2 text-base text-gray-700">
              <div>
                <span className="font-semibold">From:</span>
                <span className="ml-2">
                  {addClub.range.from.toLocaleDateString(undefined, {
                    dateStyle: 'long',
                  })}
                </span>
              </div>
              <div>
                <span className="font-semibold">To:</span>
                <span className="ml-2">
                  {addClub.range.to.toLocaleDateString(undefined, {
                    dateStyle: 'long',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
        <DayPicker
          mode="range"
          selected={addClub.range}
          onSelect={setRange}
          className="rounded-md border p-4"
          disabled={{ before: new Date() }}
        />
      </div>
      <button
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-lg font-bold text-white shadow-md transition duration-200 ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 focus:outline-hidden disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
        onClick={onClick}
        disabled={!addClub.orgId || !addClub.range.from || !addClub.range.to}
      >
        Add Club
      </button>
    </div>
  );
}
