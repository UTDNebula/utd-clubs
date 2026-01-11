import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type z from 'zod';
import { withForm } from '@src/utils/form';
import { editOfficerSchema } from '@src/utils/formSchemas';
import MemberRoleChip from './MemberRoleChip';

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

    return (
      <div className="flex flex-wrap items-center gap-2 p-2 sm:hover:bg-slate-100 dark:sm:hover:bg-slate-900 max-sm:bg-slate-100 dark:max-sm:bg-slate-900 transition-colors rounded-lg">
        <div className="flex flex-col grow pl-2 pr-4 max-h-full min-h-12 justify-center">
          <Tooltip
            title={`User ID: ${form.getFieldValue(`officers[${index}].userId`)}`}
          >
            <Typography variant="body1">
              <span>{form.getFieldValue(`officers[${index}].name`)}</span>
              {self && <span>&nbsp;(You)</span>}
            </Typography>
          </Tooltip>
          <Typography variant="caption">
            <span>{form.getFieldValue(`officers[${index}].email`)}</span>
          </Typography>
        </div>
        <div className="flex items-center gap-2 grow justify-end">
          <form.Field name={`officers[${index}].position`}>
            {(subField) => (
              <Tooltip
                title={
                  canTogglePresident
                    ? self && (
                        <div className="text-center">
                          You cannot take away your own admin status
                          <br />
                          Another admin must remove you
                        </div>
                      )
                    : 'Only an admin can change admin status'
                }
              >
                {self || !canTogglePresident ? (
                  <div className="p-2">
                    <MemberRoleChip
                      key={subField.state.value}
                      memberType={subField.state.value}
                    />
                  </div>
                ) : (
                  <FormControl className="w-fit">
                    <Select
                      id="collaborator-role-select"
                      value={subField.state.value}
                      aria-label="Role"
                      size="small"
                      onChange={(e) => subField.handleChange(e.target.value)}
                      input={
                        <OutlinedInput
                          id="collaborator-role-select"
                          readOnly={self || !canTogglePresident}
                          className="[&>.MuiOutlinedInput-notchedOutline]:rounded-full [&>.MuiSelect-select]:p-2"
                        />
                      }
                      className="pr-6 bg-white dark:bg-haiti rounded-full"
                      renderValue={(selected) => (
                        <MemberRoleChip key={selected} memberType={selected} />
                      )}
                    >
                      <MenuItem key="admin" value="President">
                        Admin
                      </MenuItem>
                      <MenuItem key="collaborator" value="Officer">
                        Collaborator
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
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
