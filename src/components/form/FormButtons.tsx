import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { useStore } from '@tanstack/react-form';
import { useFormContext, withForm } from '@src/utils/form';

export const FormSubmitButton = () => {
  const form = useFormContext();
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  return (
    <Button
      type="submit"
      variant="contained"
      className="normal-case"
      startIcon={<SaveIcon />}
      disabled={isDefaultValue}
      loading={isSubmitting}
      loadingPosition="start"
    >
      <span>Save Changes</span>
    </Button>
  );
};

export const FormResetButton = () => {
  const form = useFormContext();
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  return (
    <form.Subscribe>
      <Button
        onClick={() => {
          form.reset();
        }}
        variant="text"
        className="normal-case"
        startIcon={<DeleteIcon />}
        disabled={isDefaultValue || isSubmitting}
        color="warning"
      >
        Discard Changes
      </Button>
    </form.Subscribe>
  );
};
