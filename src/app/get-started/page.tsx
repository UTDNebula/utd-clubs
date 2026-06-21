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
    <main className="relative min-h-screen pb-24">
      <div className="bg-royal fixed inset-0 h-full w-full overflow-hidden">
        <Image
          src={'/banner.png'}
          alt="background"
          fill
          className="-z-20 object-cover select-none"
          draggable={false}
        />
        <div className="dark:bg-slightly-darken absolute inset-0" />
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
