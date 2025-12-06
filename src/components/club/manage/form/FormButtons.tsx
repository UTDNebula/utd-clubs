import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const FormSubmitButton = ({
  disabled,
  loading,
}: {
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      className="normal-case"
      startIcon={<SaveIcon />}
      disabled={disabled}
      loading={loading}
      loadingPosition="start"
    >
      <span>Save Changes</span>
    </Button>
  );
};

export const FormResetButton = ({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Button
      onClick={onClick}
      variant="text"
      className="normal-case"
      startIcon={<DeleteIcon />}
      disabled={disabled}
      color="warning"
    >
      Discard Changes
    </Button>
  );
};

type FormButtonsProps = {
  onClickDiscard?: React.MouseEventHandler<HTMLButtonElement>;
  isPending: boolean;
};

export const FormButtons = ({
  onClickDiscard,
  isPending,
}: FormButtonsProps) => {
  const methods = useFormContext();

  return (
    <div className="flex flex-wrap justify-end items-center gap-2">
      <FormResetButton
        disabled={!methods.formState.isDirty || isPending}
        onClick={
          onClickDiscard ??
          (() => {
            methods.reset();
          })
        }
      />
      <FormSubmitButton
        disabled={!methods.formState.isDirty}
        loading={isPending}
      />
    </div>
  );
};

export default FormButtons;
