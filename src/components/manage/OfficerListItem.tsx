import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import z from 'zod';
import { withForm } from '@src/utils/form';
import { type editListedOfficerSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editListedOfficerSchema>;

type OfficerListItemProps = {
  index: number;
  removeItem: (index: number) => void;
  onReorder?: () => void;
  overlayData?: FormData['officers'][number];
};

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
    id: '',
  } as OfficerListItemProps,
  render: function Render({ form, index, removeItem, overlayData }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
      isSorting,
    } = useSortable({
      id: form.getFieldValue(`officers[${index}].id`),
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 1 : 0,
    };

    const handleRemove = () => {
      removeItem(index);
      const current = form.getFieldValue('officers') as
        | FormData['officers']
        | undefined;
      const next = (current ?? []).filter((_, i) => i !== index);
      form.setFieldValue('officers', next);
    };

    console.log('isDragging', isDragging);

    return (
      <Box
        className={`relative grid sm:gap-2 transition-colors rounded-lg
          ${isDragging ? '*:invisible' : `max-sm:bg-slate-100 ${isSorting ? '' : 'sm:hover:bg-slate-100'}`}`}
        sx={{
          gridTemplateAreas: {
            sm: `'handle name position buttons'`,
            xs: `'handle name buttons' 'handle position buttons'`,
          },
          gridTemplateColumns: {
            sm: `auto 1fr 1fr auto`,
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
        <div style={{ gridArea: 'name' }} className="max-sm:mt-3 sm:my-2">
          <form.Field name={`officers[${index}].name`}>
            {(subField) => (
              <TextField
                onChange={(e) => subField.handleChange(e.target.value)}
                onBlur={subField.handleBlur}
                value={overlayData?.name ?? subField.state.value}
                label="Name"
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
          style={{ gridArea: 'position' }}
          className="max-sm:mt-3 max-sm:mb-3 sm:my-2"
        >
          <form.Field name={`officers[${index}].position`}>
            {(subField) => (
              <TextField
                onChange={(e) => subField.handleChange(e.target.value)}
                onBlur={subField.handleBlur}
                value={overlayData?.position ?? subField.state.value}
                label="Position"
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
          className="flex max-sm:h=fill sm:h-fit max-sm:ml-2 sm:my-2 mr-2"
        >
          <Tooltip title="Remove" className="h-fit self-center">
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
