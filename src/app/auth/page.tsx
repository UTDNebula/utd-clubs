import { getProviders } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import ProviderButton from '@src/app/auth/ProviderButtons';
import BackButton from '@src/components/backButton';
import { getServerAuthSession } from '@src/server/auth';

export default async function Auth(props: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getServerAuthSession();
  if (session) {
    return redirect(searchParams['callbackUrl'] ?? '/');
  }
  const providers = await getProviders();

  return (
    <main className="h-screen">
      <div className="relative flex h-screen basis-full flex-col items-center justify-center">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Image src={'/banner.png'} alt="background" fill objectFit="cover" />
        </div>
        <div className="flex flex-col gap-16">
          <div className="absolute inset-5 z-10 flex w-fit sm:static">
            <BackButton className="bg-white" />
          </div>
          <div className="z-10 flex flex-col items-center justify-center space-y-12">
            <h1 className="text-center text-6xl font-bold text-white sm:text-left">
              Sign In /<br className="sm:hidden" /> Sign Up
            </h1>
            <div className="flex w-full flex-col items-center justify-center space-y-4 gap-x-4 py-2.5 sm:flex-row sm:space-y-0">
              {Object.values(providers || {}).map((provider) => (
                <ProviderButton key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
