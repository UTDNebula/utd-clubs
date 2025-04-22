import ApprovedClub from '@src/components/admin/ApprovedClub';
import OtherClubStatus from '@src/components/admin/OtherClubStatus';
import { db } from '@src/server/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

type Props = { params: { id: string } };

export default async function Page({ params: { id } }: Props) {
  const org = await db.query.club.findFirst({
    where: (club) => eq(club.id, id),
  });
  if (!org) notFound();

  return (
    <div className="m-5 h-screen ">
      <h1 className="text-center text-4xl font-bold">{org.name}</h1>
      {org.approved === 'approved' ? (
        <ApprovedClub club={org} />
      ) : (
        <OtherClubStatus club={org} />
      )}
    </div>
  );
}
