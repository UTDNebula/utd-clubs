import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProviderButton from '@src/app/auth/ProviderButtons';
import RegisterModal, {
  RegisterModalContents,
} from '@src/components/account/RegisterModal';
import BackButton from '@src/components/backButton';
import NebulaLogo from '@src/icons/NebulaLogo';
import { auth } from '@src/server/auth';

const providers = ['google', 'discord'] as const;

export default async function Auth(props: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    return redirect(searchParams['callbackUrl'] ?? '/');
  }

  return (
    <main className="h-screen">
      <div className="relative flex h-screen basis-full flex-col items-center justify-center gap-8">
        <div className="fixed inset-0 h-full w-full overflow-hidden">
          <Image
            src={'/banner.png'}
            alt="background"
            fill
            objectFit="cover"
            className="select-none"
          />
        </div>
        <div className="z-10">
          <Link
            href="/"
            className="lext-lg md:text-xl font-display font-medium md:font-bold flex gap-2 items-center text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
          >
            <NebulaLogo className="h-6 w-auto fill-white drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]" />
            UTD CLUBS
          </Link>
        </div>
        <RegisterModalContents />
        {/* <div className="flex flex-col gap-16">
          <div className="absolute inset-5 z-10 flex w-fit sm:static">
            <BackButton className="bg-white" />
          </div>
          <div className="z-10 flex flex-col items-center justify-center space-y-12">
            <h1 className="font-display text-center text-6xl font-bold text-white sm:text-left">
              Sign In /<br className="sm:hidden" /> Sign Up
            </h1>
            <div className="flex w-full flex-col items-center justify-center space-y-4 gap-x-4 py-2.5 sm:flex-row sm:space-y-0">
              {providers.map((provider) => (
                <ProviderButton
                  key={provider}
                  provider={provider}
                  callbackUrl={searchParams['callbackUrl']}
                />
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </main>
  );
}
