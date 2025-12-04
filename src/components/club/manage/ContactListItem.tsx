import DeleteIcon from '@mui/icons-material/Delete';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import type z from 'zod';
import { type SelectContact } from '@src/server/db/models';
import { contactNames, startContacts } from '@src/server/db/schema/contacts';
import { type editClubContactSchema } from '@src/utils/formSchemas';

type Contact = Omit<SelectContact, 'clubId'>;

type ContactListItemProps = {
  control: Control<z.infer<typeof editClubContactSchema>>;
  remove: (index: number, platform: Contact['platform']) => void;
  platform: Contact['platform'];
  index: number;
  errors: FieldErrors<z.infer<typeof editClubContactSchema>>;
  available?: typeof startContacts;
};

const ContactListItem = ({
  control,
  remove,
  platform,
  index,
  errors,
  available,
}: ContactListItemProps) => {
  const fieldError = errors.contacts?.[index]?.url;

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 transition-colors rounded-lg">
      <Controller
        control={control}
        name={`contacts.${index}.platform`}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl
            size="small"
            className="[&>.MuiInputBase-root]:bg-white min-w-32"
          >
            <InputLabel id={`contacts.${index}.platform-label`}>
              Platform
            </InputLabel>
            <Select
              label="Platform"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              labelId={`contacts.${index}.platform-label`}
            >
              <MenuItem value={platform}>{contactNames[platform]}</MenuItem>
              {available &&
                available.map((platform, index) => (
                  <MenuItem key={index} value={platform}>
                    {contactNames[platform]}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name={`contacts.${index}.url`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label={platform === 'email' ? 'Email Address' : 'URL'}
            className="grow-1 [&>.MuiInputBase-root]:bg-white"
            size="small"
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />

      <div className="h-10">
        <Tooltip title="Remove">
          <IconButton
            aria-label="remove"
            title="Remove"
            onClick={() => remove(index, platform)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default ContactListItem;
