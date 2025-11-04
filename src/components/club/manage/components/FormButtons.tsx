/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useFormContext } from 'react-hook-form';
import PillButton from '@src/components/PillButton';

export const FormSubmitButton = () => {
  return <PillButton type="submit">Save Changes</PillButton>;
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
    // TODO: Add reset function for onClick
    <PillButton
      type="button"
      color="red"
      disabled={!!disabled}
      onClick={onClick}
    >
      Discard Changes
    </PillButton>
  );
};

type FormButtonsProps = {
  onClickDiscard?: React.MouseEventHandler<HTMLButtonElement>;
};

export const FormButtons = ({ onClickDiscard, ...props }: FormButtonsProps) => {
  const methods = useFormContext();

  return (
    <div className="flex gap-2">
      <FormSubmitButton />
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
