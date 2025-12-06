import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { Controller, type Control } from 'react-hook-form';
import type z from 'zod';
import { editListedOfficerSchema } from '@src/utils/formSchemas';

type Errors = {
  errors: string[];
  properties?: {
    officers?: {
      items?: {
        properties?: { [key in 'name' | 'position']?: { errors?: string[] } };
      }[];
    };
  };
};

type OfficerListItemProps = {
  control: Control<z.infer<typeof editListedOfficerSchema>>;
  remove: (index: number) => void;
  index: number;
  errors: Errors;
};

export const OfficerListItem = ({
  control,
  remove,
  index,
  errors,
}: OfficerListItemProps) => {
  const nameFieldErrors =
    errors.properties?.officers?.items?.[index]?.properties?.name?.errors;
  const positionFieldErrors =
    errors.properties?.officers?.items?.[index]?.properties?.position?.errors;

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 transition-colors rounded-lg">
      <Controller
        control={control}
        name={`officers.${index}.name`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label="Name"
            className="grow [&>.MuiInputBase-root]:bg-white"
            size="small"
            error={nameFieldErrors && nameFieldErrors.length > 0}
            helperText={nameFieldErrors?.join('. ')}
          />
        )}
      />
      <Controller
        control={control}
        name={`officers.${index}.position`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label="Position"
            className="grow [&>.MuiInputBase-root]:bg-white"
            size="small"
            error={positionFieldErrors && positionFieldErrors.length > 0}
            helperText={positionFieldErrors?.join('. ')}
          />
        )}
      />
      <Tooltip title="Remove">
        <IconButton aria-label="remove" onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default OfficerListItem;
