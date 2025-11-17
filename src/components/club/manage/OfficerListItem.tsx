import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { IconButton } from '@mui/material';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type z from 'zod';
import { type editListedOfficerSchema } from '@src/utils/formSchemas';
import FormTextField from './form/FormTextField';

// import { FormInput } from './FormComponents';

type OfficerListItemProps = {
  register: UseFormRegister<z.infer<typeof editListedOfficerSchema>>;
  remove: (index: number) => void;
  index: number;
  errors: FieldErrors<z.infer<typeof editListedOfficerSchema>>;
  isPresident: boolean;
  makePresident: (index: number) => void;
};

export const OfficerListItem = ({
  // register,
  index,
  remove,
  // errors,
  isPresident,
  makePresident,
}: OfficerListItemProps) => {
  return (
    <div className="flex flex-row px-2 py-3 hover:bg-slate-100 transition-colors rounded-lg">
      <div className="flex flex-row w-full flex-wrap">
        <FormTextField
          name={`officers.${index}.name`}
          label="Name"
          className="grow-1"
        />
        <FormTextField name={`officers.${index}.position`} label="Position" />
        <div className="h-10 mt-2">
          <IconButton
            aria-label="make president"
            title="Make President"
            className="self-center"
            onClick={() => makePresident(index)}
          >
            {isPresident ? (
              <SupervisorAccountIcon color="primary" />
            ) : (
              <PersonIcon />
            )}
          </IconButton>
          <IconButton
            aria-label="remove"
            title="Remove"
            className="self-center"
            onClick={() => remove(index)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default OfficerListItem;
