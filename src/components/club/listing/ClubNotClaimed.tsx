// component with info for clubs not on the platform
export const ClubNotClaimed = () => {
  return (
    <div className="w-full rounded-lg bg-blue-100 p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-800">
        Is this your Club or Organization?
      </h1>
      <div className="mt-4 flex flex-col space-y-4 md:mt-6 md:flex-row md:space-y-0 md:space-x-4">
        <p className="text-lg font-medium">
          If you would like to update your organization&apos;s listing please
          reach out on our{' '}
          <a
            href="https://discord.utdnebula.com/"
            className="text-royal hover:underline"
          >
            Discord
          </a>{' '}
          or{' '}
          <a
            href="https://www.instagram.com/utdnebula/"
            className="text-royal hover:underline"
          >
            {' '}
            Instagram
          </a>
          .
        </p>
      </div>
    </div>
  );
};
