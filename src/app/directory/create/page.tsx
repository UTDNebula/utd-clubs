import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';
import CreateClubForm from './createForm';
//import PreviewComponent from './PreviewComponent';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(await signInRoute('directory/create'));

  const handleUploadComplete = (imageUrl: string) => {
    console.log('Uploaded image URL:', imageUrl);
  };

  const formData = {
    name: 'Sample Club Name',
    description: 'This is a sample description for the club.',
    officers: [
      {
        id: session.user.id,
        name: session.user.name,
        position: 'President',
        locked: true,
      },
    ],
    contacts: [],
  };

  return (
    <>
      <Header />
      <main className="p-4">
        <CreateClubForm
          user={{
            id: session.user.id,
            name: session.user.name,
          }}
        />
        {//<PreviewComponent formData={} />
        }
      </main>
    </>
  );
}
