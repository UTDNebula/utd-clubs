import { headers } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import OnboardingForm from '@src/components/getting-started/OnboardingForm';
import Header from '@src/components/header/Header';
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
        <div className="absolute inset-0 dark:bg-slightly-darken" />
      </div>
      <div className="relative z-20">
        <Header
          transparent
          color="light"
          itemVisibility={{ search: false, children: false }}
        />
        <OnboardingForm userMetadata={userMetadata} withLayout />
      </div>
    </main>
  );
}
