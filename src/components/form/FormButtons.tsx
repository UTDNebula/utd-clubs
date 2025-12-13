import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { useStore } from '@tanstack/react-form';
import { useFormContext } from '@src/utils/form';

export const FormSubmitButton = () => {
  const form = useFormContext();
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const isValid = useStore(form.store, (state) => state.isValid);
  return (
    <Button
      type="submit"
      variant="contained"
      className="normal-case"
      startIcon={<SaveIcon />}
      disabled={isDefaultValue || !isValid}
      loading={isSubmitting}
      loadingPosition="start"
    >
      Save
    </Button>
  );
};

interface FormResetButtonProps {
  onClick?: () => void;
}

export const FormResetButton = ({ onClick }: FormResetButtonProps) => {
  const form = useFormContext();
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  return (
    <form.Subscribe>
      <Button
        onClick={
          onClick ??
          (() => {
            form.reset();
          })
        }
        variant="text"
        className="normal-case"
        startIcon={<DeleteIcon />}
        disabled={isDefaultValue || isSubmitting}
        color="warning"
      >
        Discard
      </Button>
    </form.Subscribe>
  );
};
