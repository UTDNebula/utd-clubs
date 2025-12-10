import { type Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import SettingsForm from '@src/components/settings/SettingsForm';
import { auth } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Settings for your UTD Clubs account.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/settings',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/settings',
    description: 'Settings for your UTD Clubs account.',
  },
};
const Settings = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('settings'));
  }

  return (
    <>
      <Header />
      <main className="flex w-full flex-col items-center justify-center">
        <SettingsForm session={session} />
      </main>
    </>
  );
};

export default Settings;
