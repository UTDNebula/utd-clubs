import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const FormSubmitButton = ({
  isDirty,
  ...props
}: {
  isDirty?: boolean;
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      className="normal-case"
      startIcon={<SaveIcon />}
      size="large"
      {...props}
    >
      <span>Save Changes{isDirty && '*'}</span>
    </Button>
  );
};

export const FormResetButton = ({
  disabled,
  onClick,
  ...props
}: {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      className="normal-case"
      startIcon={<DeleteIcon />}
      size="large"
      disabled={!!disabled}
      color="warning"
      {...props}
    >
      Discard Changes
    </Button>
  );
};

type FormButtonsProps = {
  onClickDiscard?: React.MouseEventHandler<HTMLButtonElement>;
};

export const FormButtons = ({ onClickDiscard, ...props }: FormButtonsProps) => {
  const methods = useFormContext();

  return (
    <div className="flex gap-2" {...props}>
      <FormSubmitButton isDirty={methods.formState.isDirty} />
      <FormResetButton
        disabled={!methods.formState.isDirty}
        onClick={
          onClickDiscard ??
          (() => {
            methods.reset();
          })
        }
      />
    </div>
  );
};

export default FormButtons;
