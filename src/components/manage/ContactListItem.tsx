import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
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
      <>
        <Box
          className="grid sm:gap-2 max-sm:gap-4 p-2 sm:hover:bg-slate-100 dark:sm:hover:bg-slate-900 max-sm:bg-slate-100 dark:max-sm:bg-slate-900 transition-colors rounded-lg"
          sx={{
            gridTemplateAreas: {
              sm: `'name url buttons'`,
              xs: `'name buttons' 'url url'`,
            },
            gridTemplateColumns: {
              sm: `auto 1fr auto`,
              xs: `1fr auto`,
            },
          }}
        >
          <div style={{ gridArea: 'name' }} className="h-full">
            <Typography className="flex min-w-32 px-2 h-full items-center">
              {contactNames[form.getFieldValue(`contacts[${index}].platform`)]}
            </Typography>
          </div>
          <div style={{ gridArea: 'url' }} className="">
            <form.Field name={`contacts[${index}].url`}>
              {(subField) => (
                <TextField
                  onChange={(e) => subField.handleChange(e.target.value)}
                  onBlur={subField.handleBlur}
                  value={subField.state.value}
                  label={
                    subField.state.value === 'email' ? 'Email Address' : 'URL'
                  }
                  className="w-full [&>.MuiInputBase-root]:bg-white  dark:[&>.MuiInputBase-root]:bg-haiti"
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
                          .join('. ') + '.'
                      : undefined
                  }
                />
              )}
            </form.Field>
          </div>
          <div style={{ gridArea: 'buttons' }}>
            <Tooltip title="Remove">
              <IconButton aria-label="remove" onClick={handleRemove}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Box>
      </>
    );
  },
});

export default ContactListItem;
