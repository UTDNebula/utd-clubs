import { db } from '@src/server/db';
import { type SelectClub } from '@src/server/db/models';
import { and, eq } from 'drizzle-orm';
import ChangeClubStatus from './ChangeClubStatus';

type Props = { club: SelectClub };

export default async function PendingClub({ club }: Props) {
  const president = await db.query.userMetadataToClubs.findFirst({
    where: (umtc) =>
      and(eq(umtc.clubId, club.id), eq(umtc.memberType, 'President')),
    with: { userMetadata: true },
  });

  if (!president)
    return <h1 className="text-2xl font-bold text-red-500">Error</h1>;

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-lg">
      <div className="space-y-3">
        {club.description.split('\n').map((line, i) => (
          <p key={i} className="text-base leading-relaxed text-gray-700">
            {line}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-lg font-semibold text-indigo-700">Tags:</span>
        {club.tags.map((tag) => (
          <div
            key={tag}
            className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm text-indigo-700 transition-colors duration-300 hover:bg-indigo-200"
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <span className="text-lg font-semibold text-indigo-700">
          President:
        </span>
        <div>
          <span className="text-base text-gray-800">
            {president.userMetadata.firstName} {president.userMetadata.lastName}
          </span>
        </div>
      </div>
      <ChangeClubStatus status={club.approved} clubId={club.id} />
    </div>
  );
}
