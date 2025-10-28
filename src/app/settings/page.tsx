import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import SettingsForm from '@src/components/settings/SettingsForm';
import { getServerAuthSession } from '@src/server/auth';
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
  const session = await getServerAuthSession();

  if (!session) {
    redirect(signInRoute('settings'));
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Header />
      <SettingsForm session={session} />
    </div>
  );
};

export default Settings;
