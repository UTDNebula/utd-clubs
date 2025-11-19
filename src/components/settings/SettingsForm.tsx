import { eq } from 'drizzle-orm';
import { type Session } from 'next-auth';
import { db } from '@src/server/db';
import FormCard from './FormCard';

async function SettingsForm({ session }: { session: Session }) {
  const user = session.user;
  if (!user) return null;

  const clubs = await db.query.userMetadataToClubs.findMany({
    where: (joinTable) => eq(joinTable.userId, user.id),
    with: { club: true },
    columns: {
      clubId: false,
      userId: false,
    },
  });

  const formatted = clubs.map(({ club }) => club);

  return (
    <div className="m-auto w-full rounded-xl p-4">
      <div>
        <div className="h-24 rounded-t-3xl bg-linear-to-r from-[#5A49F7] from-[4.36%] via-[#9403D8] via-[49.74%] to-[#FD9365] p-6" />
        <div className="bg-white p-6">
          <h1 className="py-2 text-3xl font-semibold">Settings</h1>
          <FormCard user={session.user} clubs={formatted} />
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;
