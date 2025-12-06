import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { IconButton, Tooltip } from '@mui/material';
import { Controller, type Control } from 'react-hook-form';
import type z from 'zod';
import { editOfficerSchema } from '@src/utils/formSchemas';

type CollaboratorListItemProps = {
  control: Control<z.infer<typeof editOfficerSchema>>;
  remove: (index: number) => void;
  index: number;
  name: string;
  canRemove: boolean;
  canTogglePresident: boolean;
};

const CollaboratorListItem = ({
  control,
  remove,
  index,
  name,
  canRemove,
  canTogglePresident,
}: CollaboratorListItemProps) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 transition-colors rounded-lg">
      <span className="grow px-4">{name}</span>
      <Controller
        control={control}
        name={`officers.${index}.position`}
        render={({ field }) => (
          <Tooltip
            title={
              canTogglePresident
                ? field.value === 'President'
                  ? 'Make Collaborator'
                  : 'Make Admin'
                : 'Only an admin can change admin status'
            }
          >
            {/* This span is required to ensure the locked tooltip shows when the IconButton is disabled */}
            <span>
              <IconButton
                aria-label="change admin status"
                onClick={() =>
                  field.onChange(
                    field.value === 'President' ? 'Officer' : 'President',
                  )
                }
                disabled={!canTogglePresident}
              >
                {field.value === 'President' ? (
                  <SupervisorAccountIcon
                    color={canTogglePresident ? 'primary' : undefined}
                  />
                ) : (
                  <PersonIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      />
      <Tooltip title={canRemove ? 'Remove' : 'Only an admin can remove people'}>
        {/* This span is required to ensure the locked tooltip shows when the IconButton is disabled */}
        <span>
          <IconButton
            aria-label="remove"
            onClick={() => remove(index)}
            disabled={!canRemove}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

export default CollaboratorListItem;
