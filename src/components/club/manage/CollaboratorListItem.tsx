import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Controller, useFormContext, type Control } from 'react-hook-form';
import type z from 'zod';
import { editOfficerSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editOfficerSchema>;

type CollaboratorListItemProps = {
  control: Control<FormData>;
  remove: (index: number) => void;
  index: number;
  name: string;
  canRemove: boolean;
  canTogglePresident: boolean;
  self?: boolean;
};

const CollaboratorListItem = ({
  control,
  remove,
  index,
  name,
  canRemove,
  canTogglePresident,
  self,
}: CollaboratorListItemProps) => {
  const methods = useFormContext();

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 transition-colors rounded-lg">
      <Typography className="grow px-4">
        <span>{name}</span>
        {self && <span>&nbsp;(You)</span>}
      </Typography>
      {/* This method is watched because it is dynamically changed when user presses the `change admin status` button */}
      {methods.watch(`officers.${index}.position`) == 'President' && (
        <Typography variant="caption" className="self-center">
          Admin
        </Typography>
      )}
      <Controller
        control={control}
        name={`officers.${index}.position`}
        render={({ field }) => (
          <Tooltip
            title={
              canTogglePresident ? (
                self ? (
                  <div className="text-center">
                    You cannot take away your own admin status
                    <br />
                    Another admin must remove you
                  </div>
                ) : field.value === 'President' ? (
                  'Make Collaborator'
                ) : (
                  'Make Admin'
                )
              ) : (
                'Only an admin can change admin status'
              )
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
                disabled={self || !canTogglePresident}
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
      <Tooltip
        title={
          canRemove ? (
            self ? (
              <div className="text-center">
                You cannot remove yourself
                <br />
                Another admin must remove you
              </div>
            ) : (
              'Remove'
            )
          ) : (
            'Only an admin can remove people'
          )
        }
      >
        {/* This span is required to ensure the locked tooltip shows when the IconButton is disabled */}
        <span>
          <IconButton
            aria-label="remove"
            onClick={() => remove(index)}
            disabled={self || !canRemove}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

export default CollaboratorListItem;
