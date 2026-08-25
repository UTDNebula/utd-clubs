import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UTDClubsLogoStandalone } from '@/lib/icons/UTDClubsLogo';
import { LoginModalContents } from '@/lib/modules/loginModal';
import { auth } from '@/server/auth';

export default async function Auth(props: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const [searchParams, session] = await Promise.all([
    props.searchParams,
    auth.api.getSession({ headers: await headers() }),
  ]);
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
            className="object-cover select-none"
          />
        </div>
        <div className="dark:bg-slightly-darken fixed inset-0" />
        <div className="z-10">
          <Link
            href="/"
            className="font-display flex items-center gap-2 text-white drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] select-none"
          >
            <div className="flex flex-row items-center">
              <UTDClubsLogoStandalone className="h-10 w-auto fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-5 font-bold whitespace-nowrap md:text-xl">
                UTD CLUBS
              </span>
              <span className="text-xs font-medium whitespace-nowrap md:text-sm">
                by Nebula Labs
              </span>
            </div>
          </Link>
        </div>
        <LoginModalContents />
      </div>
    </main>
  );
}
