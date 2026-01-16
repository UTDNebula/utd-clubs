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
        className="h-10 w-10 bg-slate-200 dark:bg-slate-800 text-slate-500 text-sm font-bold"
      >
        {officer.name.charAt(0)}
      </Avatar>
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words line-clamp-2">
          {officer.name}
        </p>
        <p className="text-sm break-words whitespace-normal text-slate-600 dark:text-slate-400 leading-tight">
          {officer.position}
        </p>
      </div>
    </div>
  );
};

export default ClubOfficer;
