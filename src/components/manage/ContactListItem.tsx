import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import type z from 'zod';
import { contactNames } from '@src/server/db/schema/contacts';
import { withForm } from '@src/utils/form';
import { type editClubContactSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editClubContactSchema>;

type ContactListItemProps = {
  index: number;
  removeItem: (index: number) => void;
  onReorder?: () => void;
  overlayData?: FormData['contacts'][number];
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
    onReorder: () => {},
    dragOverlay: false,
  } as ContactListItemProps,
  render: function Render({ form, index, removeItem, overlayData }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
      isSorting,
    } = useSortable({ id: form.getFieldValue(`contacts[${index}].platform`) });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 1 : 0,
    };

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
          className={`relative grid gap-2 transition-colors rounded-lg h-fit
            ${isDragging ? '*:invisible' : `max-sm:bg-slate-100 ${isSorting ? '' : 'sm:hover:bg-slate-100'}`}`}
          sx={{
            gridTemplateAreas: {
              sm: `'handle name url buttons'`,
              xs: `'handle name buttons' 'url url url'`,
            },
            gridTemplateColumns: {
              sm: `auto auto 1fr auto`,
              xs: `auto 1fr auto`,
            },
          }}
          ref={setNodeRef}
          style={style}
        >
          {isDragging && (
            <div className="absolute inset-0 m-1 outline-royal/50 outline-2 rounded-lg visible!" />
          )}
          <div
            style={{ gridArea: 'handle' }}
            className="h-full flex items-center select-none cursor-grab rounded-md touch-none max-sm:p-4 sm:p-2"
            {...attributes}
            {...listeners}
          >
            <DragIndicatorIcon />
          </div>
          <div style={{ gridArea: 'name' }} className="">
            <Typography className="flex min-w-32 px-2 h-full items-center">
              {contactNames[form.getFieldValue(`contacts[${index}].platform`)]}
            </Typography>
          </div>
          <div
            style={{ gridArea: 'url' }}
            className="max-sm:mx-2 max-sm:mb-2 sm:my-2"
          >
            <form.Field name={`contacts[${index}].url`}>
              {(subField) => (
                <TextField
                  onChange={(e) => subField.handleChange(e.target.value)}
                  onBlur={subField.handleBlur}
                  value={overlayData?.url ?? subField.state.value}
                  label={
                    subField.state.value === 'email' ? 'Email Address' : 'URL'
                  }
                  className="w-full [&>.MuiInputBase-root]:bg-white"
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
          <div
            style={{ gridArea: 'buttons' }}
            className="flex h-fit max-sm:mt-2 max-sm:mb-0 sm:my-2 mr-2"
          >
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
