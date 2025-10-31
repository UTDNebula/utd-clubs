import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import { redirect, notFound } from 'next/navigation';
import UploadImage from './UploadImage';

const UploadPage = async ({ params }: { params: { clubId: string } }) => {
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect(signInRoute(`manage/${params.clubId}/upload`));
  }

  const officerClubs = await api.club.getOfficerClubs();
  const currentClub = officerClubs.filter((val) => {
    return val.id == params.clubId;
  })[0];

  if (!currentClub) {
    notFound();
  }

  return (
    <main className="h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">Upload Images for Club</h1>
        <UploadImage clubId={currentClub.id} />
      </div>
    </main>
  );
};

export default UploadPage;