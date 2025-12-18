import { IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';
import { logo } from '@src/icons/ContactIcons';
import type { SelectContact } from '@src/server/db/models';
import { contactNames } from '@src/server/db/schema/contacts';

type ClubOfficerProps = {
  officer: {
    id: string;
    name: string;
    clubId: string;
    position: string;
  };
};
const ClubOfficer = ({ officer }: ClubOfficerProps) => {
  return (
      <div className="mt-5 flex flex-row" key={officer.id}>
            <div className="mx-5 flex flex-col justify-center align-middle">
                <p className="text-left text-sm break-words whitespace-normal text-slate-600">
                {officer.name}
                </p>
                <p className="mt-2 text-sm break-words whitespace-normal text-slate-400">
                {officer.position}
                </p>
            </div>
        </div>
  );
};

export default ClubOfficer;
