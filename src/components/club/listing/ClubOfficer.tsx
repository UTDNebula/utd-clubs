import Image from 'next/image';
import { SelectOfficer } from '@src/server/db/models';

type ClubOfficerProps = {
  officer: SelectOfficer & { image?: string };
};
const ClubOfficer = ({ officer }: ClubOfficerProps) => {
  return (
    <div className="flex flex-row items-center gap-4 py-1" key={officer.id}>
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100">
        {officer.image ? (
          <Image
            src={officer.image}
            alt={officer.name}
            fill
            className="object-cover"
          />
        ) : (
          // fallback to first initial if no image
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500 text-sm font-bold">
            {officer.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate">
          {officer.name}
        </p>
        <p className="text-sm break-words whitespace-normal text-slate-400 leading-tight">
          {officer.position}
        </p>
      </div>
    </div>
  );
};

export default ClubOfficer;
