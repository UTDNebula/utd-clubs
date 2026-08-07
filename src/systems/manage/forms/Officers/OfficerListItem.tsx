import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, IconButton, Tooltip } from '@mui/material';
import z from 'zod';
import { withForm } from '@/common/utils/form';
import { type editListedOfficerSchema } from './schema';

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

    // Styles related to drag and drop sorting.
    // This follows the convention of `dnd-kit` documentation using the `style` prop
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

    return (
      <Box
        // isDragging: If true, hide visibility of children but keep them in document flow (to maintain size of list item)
        //   - Do NOT use the `hidden` class, as this removes children from the document flow
        // isSorting: If true, disable hover state, to prevent visual noise when reordering items
        className={`relative grid rounded-lg transition-colors sm:gap-2 ${isDragging ? '*:invisible' : `max-sm:bg-neutral-100 dark:max-sm:bg-neutral-800 ${isSorting ? '' : 'sm:hover:bg-neutral-100 dark:sm:hover:bg-neutral-800'}`}`}
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
          // Placeholder/ghost element indicator. Note the `visible!` to ensure this element remains visible
          <div className="outline-royal/50 visible! absolute inset-0 m-1 rounded-lg outline-2" />
        )}
        <div
          style={{ gridArea: 'handle' }}
          className="flex h-full cursor-grab touch-none items-center rounded-md select-none max-sm:p-4 sm:p-2"
          {...attributes} // Makes handle tabbable for keyboard input
          {...listeners} // Turns element into a drag handle
        >
          <DragIndicatorIcon />
        </div>
        <div style={{ gridArea: 'name' }} className="max-sm:mt-3 sm:my-2">
          <form.AppField name={`officers[${index}].name`}>
            {(subField) => (
              <subField.TextField
                label="Name"
                className="w-full"
                {...(overlayData?.name !== undefined
                  ? { value: overlayData.name }
                  : {})}
              />
            )}
          </form.AppField>
        </div>
        <div
          style={{ gridArea: 'position' }}
          className="max-sm:mt-3 max-sm:mb-3 sm:my-2"
        >
          <form.AppField name={`officers[${index}].position`}>
            {(subField) => (
              <subField.TextField
                label="Position"
                className="w-full"
                {...(overlayData?.position !== undefined
                  ? { value: overlayData.position }
                  : {})}
              />
            )}
          </form.AppField>
        </div>
        <div
          style={{ gridArea: 'buttons' }}
          className="mr-2 flex max-sm:ml-2 max-sm:h-full sm:my-2 sm:h-fit"
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
