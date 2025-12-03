import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ApprovedClub from '@src/components/admin/ApprovedClub';
import OtherClubStatus from '@src/components/admin/OtherClubStatus';
import { db } from '@src/server/db';

type Props = { params: Promise<{ id: string }> };

export default async function Page(props: Props) {
  const params = await props.params;

  const { id } = params;

  const org = await db.query.club.findFirst({
    where: (club) => eq(club.id, id),
  });
  if (!org) notFound();

  return (
    <div className="m-5">
      <h1 className="font-display text-center text-4xl font-bold text-haiti mb-20">
        {org.name}
      </h1>
      {org.approved === 'approved' ? (
        <ApprovedClub club={org} />
      ) : (
        <OtherClubStatus club={org} />
      )}
    </div>
  );
}
