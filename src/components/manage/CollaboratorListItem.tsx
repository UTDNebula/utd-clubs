import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { IconButton, Tooltip, Typography } from '@mui/material';
import type z from 'zod';
import { withForm } from '@src/utils/form';
import { editOfficerSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editOfficerSchema>;

const CollaboratorListItem = withForm({
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
    canRemove: false,
    canTogglePresident: false,
    self: false,
  },
  render: function Render({
    form,
    index,
    removeItem,
    canRemove,
    canTogglePresident,
    self,
  }) {
    const handleRemove = () => {
      removeItem(index);
      const current = form.getFieldValue('officers') as
        | FormData['officers']
        | undefined;
      const next = (current ?? []).filter((_, i) => i !== index);
      form.setFieldValue('officers', next);
    };

    // TODO: Insert code to fetch email by userID

    return (
      <div className="flex flex-wrap items-center gap-2 p-2 sm:hover:bg-slate-100 max-sm:bg-slate-100 transition-colors rounded-lg">
        <div className="flex flex-col grow pl-2 pr-4 max-h-full min-h-10 justify-center">
          <Typography variant="body1">
            <span>{form.getFieldValue(`officers[${index}].name`)}</span>
            {self && <span>&nbsp;(You)</span>}
          </Typography>
        </div>
        <div className="flex gap-2 grow justify-end">
          {form.getFieldValue(`officers[${index}].position`) == 'President' && (
            <Typography variant="caption" className="self-center">
              Admin
            </Typography>
          )}
          <form.Field name={`officers[${index}].position`}>
            {(subField) => (
              <Tooltip
                title={
                  canTogglePresident ? (
                    self ? (
                      <div className="text-center">
                        You cannot take away your own admin status
                        <br />
                        Another admin must remove you
                      </div>
                    ) : subField.state.value === 'President' ? (
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
                      subField.handleChange(
                        subField.state.value === 'President'
                          ? 'Officer'
                          : 'President',
                      )
                    }
                    // disabled={self || !canTogglePresident}
                  >
                    {subField.state.value === 'President' ? (
                      <SupervisorAccountIcon
                        color={
                          canTogglePresident && !self ? 'primary' : undefined
                        }
                      />
                    ) : (
                      <PersonIcon />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </form.Field>
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
                onClick={handleRemove}
                disabled={self || !canRemove}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
    );
  },
});

export default CollaboratorListItem;
