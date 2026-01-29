import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RegisterModalContents } from '@src/components/account/RegisterModal';
import { UTDClubsLogoStandalone } from '@src/icons/UTDClubsLogo';
import { auth } from '@src/server/auth';

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
        <div className="fixed inset-0 dark:bg-slightly-darken" />
        <div className="z-10">
          <Link
            href="/"
            className="font-display flex gap-2 items-center select-none text-white drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
          >
            <div className="flex flex-row items-center">
              <UTDClubsLogoStandalone className="h-10 w-auto fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="whitespace-nowrap text-lg md:text-xl font-bold leading-5">
                UTD CLUBS
              </span>
              <span className="whitespace-nowrap text-xs md:text-sm font-medium">
                by Nebula Labs
              </span>
            </div>
          </Link>
        </div>
        <RegisterModalContents />
      </div>
    </main>
  );
}
