import ClubTable from '@src/components/admin/ClubTable';
import { api } from '@src/trpc/server';

export default async function Page() {
  const clubs = await api.admin.allClubs();
  return <ClubTable clubs={clubs} />;
}
