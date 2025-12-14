import AdminHeader from '@src/components/admin/AdminHeader';
import ClubTable from '@src/components/admin/ClubTable';
import { api } from '@src/trpc/server';

export default async function Page() {
  const clubs = await api.admin.allClubs();

  return (
    <>
      <AdminHeader path={[{ text: 'Admin', href: '/admin' }, 'Clubs']} />
      <div className="flex w-full flex-col items-center">
        <ClubTable clubs={clubs} />
      </div>
    </>
  );
}
