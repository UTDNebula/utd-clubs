import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import OnboardingForm from '@src/components/getting-started/OnboardingForm';
import { ProfileDropDown } from '@src/components/header/ProfileDropDown';
import Sidebar from '@src/components/nav/Sidebar';
import NebulaLogo from '@src/icons/NebulaLogo';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('get-started'));
  }

  const userMetadata = await api.userMetadata.byId({ id: session.user.id });

  return (
    <main className="h-screen relative">
      <div className="fixed inset-0 h-full w-full overflow-hidden bg-royal">
        <Image
          src={'/banner.png'}
          alt="background"
          fill
          objectFit="cover"
          className="select-none -z-20"
          draggable={false}
        />
      </div>
      <div className="relative z-20">
        <div className="top-0 z-50 flex w-full justify-between items-center gap-y-0 gap-x-2 md:gap-x-4 lg:gap-x-8 py-2 px-2 sm:px-4 flex-wrap sm:flex-nowrap min-h-17">
          <div className="grow basis-0 flex gap-x-2 md:gap-x-4 lg:gap-x-8">
            <Sidebar hamburger="white" shadow />
            <Link
              href="/"
              className="lext-lg md:text-xl font-display font-medium md:font-bold flex gap-2 items-center text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
            >
              <NebulaLogo className="h-6 w-auto fill-white drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]" />
              <span className="whitespace-nowrap">UTD CLUBS</span>
            </Link>
          </div>
          <div className="grow order-last basis-full sm:order-none sm:basis-auto gap-x-2 md:gap-x-4 lg:gap-x-8"></div>
          <div className="grow basis-0 flex justify-end items-center gap-x-2">
            <ProfileDropDown />
          </div>
        </div>
        <OnboardingForm userMetadata={userMetadata} withLayout />
      </div>
    </main>
  );
}
