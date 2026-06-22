import { Avatar } from '@mui/material';
import { SelectOfficer } from '@src/server/db/models';

type ClubOfficerProps = {
  officer: SelectOfficer;
};
const ClubOfficer = ({ officer }: ClubOfficerProps) => {
  return (
    <div className="flex flex-row items-center gap-4 py-1" key={officer.id}>
      <Avatar
        alt={officer.name}
        className="h-10 w-10 bg-neutral-200 text-sm font-bold text-slate-500 dark:bg-neutral-900"
      >
        {officer.name.charAt(0)}
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <p className="line-clamp-2 text-sm font-semibold break-words text-slate-800 dark:text-slate-200">
          {officer.name}
        </p>
        <p className="text-sm leading-tight break-words whitespace-normal text-slate-600 dark:text-slate-400">
          {officer.position}
        </p>
      </div>
    </div>
  );
};

export default ClubOfficer;
