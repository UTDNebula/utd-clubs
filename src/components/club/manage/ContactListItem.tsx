import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Tooltip, Typography } from '@mui/material';
import type z from 'zod';
import { contactNames } from '@src/server/db/schema/contacts';
import { withForm } from '@src/utils/form';
import { type editClubContactSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editClubContactSchema>;

type ContactListItemProps = {
  index: number;
  removeItem: (index: number) => void;
};

const ContactListItem = withForm({
  // These values are only used for type-checking, and are not used at runtime
  // This allows you to `...formOpts` from `formOptions` without needing to redeclare the options
  defaultValues: {} as FormData,
  // Optional, but adds props to the `render` function in addition to `form`
  props: {
    // These props are also set as default values for the `render` function
    index: 0,
    removeItem: (index: number) => {
      console.log(index);
    },
  } as ContactListItemProps,
  render: function Render({ form, index, removeItem }) {
    const handleRemove = () => {
      removeItem(index);
      const current = form.getFieldValue('contacts') as
        | FormData['contacts']
        | undefined;
      const next = (current ?? []).filter((_, i) => i !== index);
      form.setFieldValue('contacts', next);
    };

    return (
      <div className="flex items-center gap-2 p-2 pl-0 hover:bg-slate-100 transition-colors rounded-lg">
        <Typography className="min-w-32 px-4">
          {contactNames[form.getFieldValue(`contacts[${index}].platform`)]}
        </Typography>
        <form.Field name={`contacts[${index}].url`}>
          {(subField) => (
            <TextField
              onChange={(e) => subField.handleChange(e.target.value)}
              onBlur={subField.handleBlur}
              value={subField.state.value}
              label={subField.state.value === 'email' ? 'Email Address' : 'URL'}
              className="grow [&>.MuiInputBase-root]:bg-white"
              size="small"
              error={!subField.state.meta.isValid}
              helperText={
                !subField.state.meta.isValid
                  ? (
                      subField.state.meta.errors as unknown as {
                        message: string;
                      }[]
                    )
                      .map((err) => err?.message)
                      .join('. ')
                  : undefined
              }
            />
          )}
        </form.Field>
        <Tooltip title="Remove">
          <IconButton aria-label="remove" onClick={handleRemove}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  },
});

export default ContactListItem;
