// component with info for clubs not on the platform

import { BaseCard } from '@src/components/common/BaseCard';

export const ClubNotClaimed = () => {
  return (
    <BaseCard className="w-full bg-cornflower-50 p-6 md:p-10">
      <h2 className="text-2xl font-semibold text-slate-800">
        Is this your Club or Organization?
      </h2>
      <div className="mt-4 flex flex-col space-y-4 md:mt-6 md:flex-row md:space-y-0 md:space-x-4">
        <p className="text-lg font-medium">
          If you would like to update your organization&apos;s listing please
          reach out on our{' '}
          <a
            href="https://discord.utdnebula.com/"
            className="text-royal underline decoration-transparent hover:decoration-inherit transition"
          >
            Discord
          </a>{' '}
          or{' '}
          <a
            href="https://www.instagram.com/utdnebula/"
            className="text-royal underline decoration-transparent hover:decoration-inherit transition"
          >
            {' '}
            Instagram
          </a>
          .
        </p>
      </div>
    </BaseCard>
  );
};
