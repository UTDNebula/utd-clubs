import PillButton from '@src/components/PillButton';

export const FormSubmitButton = () => {
  return <PillButton type="submit">Save Changes</PillButton>;
};

export const FormResetButton = ({ disabled }: { disabled?: boolean }) => {
  return (
    // TODO: Add reset function for onClick
    <PillButton type="button" color="red" disabled={disabled}>
      Discard Changes
    </PillButton>
  );
};

export const FormButtons = () => {
  return (
    <div className="flex gap-2">
      <FormSubmitButton />
      <FormResetButton disabled />
    </div>
  );
};

export default FormButtons