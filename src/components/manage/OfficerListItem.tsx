import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import z from 'zod';
import { withForm } from '@src/utils/form';
import { editListedOfficerSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editListedOfficerSchema>;

const OfficerListItem = withForm({
  // These values are only used for type-checking, and are not used at runtime
  // This allows you to `...formOpts` from `formOptions` without needing to redeclare the options
  defaultValues: {
    officers: [
      { name: '', position: 'Officer', id: undefined },
      { name: '', position: 'Officer', id: '' },
    ],
  },
  // Optional, but adds props to the `render` function in addition to `form`
  props: {
    // These props are also set as default values for the `render` function
    index: 0,
    removeItem: (index: number) => {
      console.log(index);
    },
  },
  render: function Render({ form, index, removeItem }) {
    const handleRemove = () => {
      removeItem(index);
      const current = form.getFieldValue('officers') as
        | FormData['officers']
        | undefined;
      const next = (current ?? []).filter((_, i) => i !== index);
      form.setFieldValue('officers', next);
    };

    return (
      <Box
        className="grid sm:gap-2 max-sm:gap-4 p-2 max-sm:pt-4 sm:hover:bg-slate-100 dark:sm:hover:bg-slate-900 max-sm:bg-slate-100 dark:max-sm:bg-slate-900 transition-colors rounded-lg"
        sx={{
          gridTemplateAreas: {
            sm: `'name position buttons'`,
            xs: `'name buttons' 'position position'`,
          },
          gridTemplateColumns: {
            sm: `1fr 1fr auto`,
            xs: `1fr auto`,
          },
        }}
      >
        <div style={{ gridArea: 'name' }}>
          <form.Field name={`officers[${index}].name`}>
            {(subField) => (
              <TextField
                onChange={(e) => subField.handleChange(e.target.value)}
                onBlur={subField.handleBlur}
                value={subField.state.value}
                label="Name"
                className="w-full [&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
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
        <div style={{ gridArea: 'position' }}>
          <form.Field name={`officers[${index}].position`}>
            {(subField) => (
              <TextField
                onChange={(e) => subField.handleChange(e.target.value)}
                onBlur={subField.handleBlur}
                value={subField.state.value}
                label="Position"
                className="w-full [&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
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
    );
  },
});

export default OfficerListItem;
