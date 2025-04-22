import { getServerAuthSession } from '@src/server/auth';
import SettingsForm from '@src/components/settings/SettingsForm';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { signInRoute } from '@src/utils/redirect';
export const metadata: Metadata = {
  title: 'Settings - Jupiter',
  description: 'Settings for your Jupiter account',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/settings',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/settings',
    description: 'Settings - Jupiter',
  },
};
const Settings = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(signInRoute('settings'));
  }

  return (
    <div className="flex w-full flex-col items-center justify-center ">
      <Header />
      <SettingsForm session={session} />
    </div>
  );
};

export default Settings;
