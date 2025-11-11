import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { IconButton } from '@mui/material';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type z from 'zod';
import { type editListedOfficerSchema } from '@src/utils/formSchemas';
import { FormInput } from './FormComponents';

type OfficerListItemProps = {
  register: UseFormRegister<z.infer<typeof editListedOfficerSchema>>;
  remove: (index: number) => void;
  index: number;
  errors: FieldErrors<z.infer<typeof editListedOfficerSchema>>;
  isPresident: boolean;
  makePresident: (index: number) => void;
};

export const OfficerListItem = ({
  register,
  index,
  remove,
  errors,
  isPresident,
  makePresident,
}: OfficerListItemProps) => {
  return (
    <div className="flex flex-row items-center p-2">
      <div className="flex flex-row w-full flex-wrap">
        <FormInput
          type="text"
          label="Name"
          name={`officers.${index}.name`}
          register={register}
          error={errors.officers && errors?.officers[index]?.name}
          aria-invalid={errors.officers && !!errors.officers[index]?.name}
          className="grow-1"
        ></FormInput>
        <FormInput
          type="text"
          label="Position"
          name={`officers.${index}.position`}
          register={register}
          error={errors.officers && errors?.officers[index]?.position}
          aria-invalid={errors.officers && !!errors.officers[index]?.position}
        ></FormInput>

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
  );
};

export default OfficerListItem;
