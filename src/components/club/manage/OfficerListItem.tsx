import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Tooltip } from '@mui/material';
import z from 'zod';
import { withForm } from '@src/utils/form';
import { editListedOfficerSchema } from '@src/utils/formSchemas';

type OfficersFormValues = z.infer<typeof editListedOfficerSchema>;

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
        | OfficersFormValues['officers']
        | undefined;
      const next = (current ?? []).filter((_, i) => i !== index);
      form.setFieldValue('officers', next);
    };

    return (
      <div className="flex items-center gap-2 p-2 hover:bg-slate-100 transition-colors rounded-lg">
        <form.Field name={`officers[${index}].name`}>
          {(subField) => (
            <TextField
              onChange={(e) => subField.handleChange(e.target.value)}
              onBlur={subField.handleBlur}
              value={subField.state.value}
              label="Name"
              className="grow [&>.MuiInputBase-root]:bg-white"
              size="small"
              error={!subField.state.meta.isValid}
              helperText={
                !subField.state.meta.isValid
                  ? subField.state.meta.errors
                      .map((err) => err?.message)
                      .join('. ')
                  : undefined
              }
            />
          )}
        </form.Field>
        <form.Field name={`officers[${index}].position`}>
          {(subField) => (
            <TextField
              onChange={(e) => subField.handleChange(e.target.value)}
              onBlur={subField.handleBlur}
              value={subField.state.value}
              label="Position"
              className="grow [&>.MuiInputBase-root]:bg-white"
              size="small"
              error={!subField.state.meta.isValid}
              helperText={
                !subField.state.meta.isValid
                  ? subField.state.meta.errors
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

/*export const OfficerListItem = ({
  index,
  field,
}: OfficerListItemProps) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 transition-colors rounded-lg">
      <form.Field name={`officers[${index}].name`}>
        {(subField) => (
          <TextField
            onChange={(e) => subField.handleChange(e.target.value)}
            onBlur={subField.handleBlur}
            value={subField.state.value}
            label="Name"
            className="grow [&>.MuiInputBase-root]:bg-white"
            size="small"
            error={!subField.state.meta.isValid}
            helperText={
              !subField.state.meta.isValid
                ? subField.state.meta.errors
                    .map((err) => err?.message)
                    .join('. ')
                : undefined
            }
          />
        )}
      </form.Field>
      <form.Field name={`officers[${index}].position`}>
        {(subField) => (
          <TextField
            onChange={(e) => subField.handleChange(e.target.value)}
            onBlur={subField.handleBlur}
            value={subField.state.value}
            label="Position"
            className="grow [&>.MuiInputBase-root]:bg-white"
            size="small"
            error={!subField.state.meta.isValid}
            helperText={
              !subField.state.meta.isValid
                ? subField.state.meta.errors
                    .map((err) => err?.message)
                    .join('. ')
                : undefined
            }
          />
        )}
      </form.Field>
      <Tooltip title="Remove">
        <IconButton aria-label="remove" onClick={() => field.removeValue(index)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};*/

export default OfficerListItem;
