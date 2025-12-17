import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { useStore } from '@tanstack/react-form';
import { useFormContext } from '@src/utils/form';

interface FormSubmitButtonProps {
  text?: string;
  icon?: React.ElementType;
  onClick?: () => void;
}

export const FormSubmitButton = ({
  text,
  icon,
  onClick,
}: FormSubmitButtonProps) => {
  const form = useFormContext();
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const isValid = useStore(form.store, (state) => state.isValid);
  const IconComponent = icon ?? SaveIcon;

  return (
    <Button
      type="submit"
      variant="contained"
      className="normal-case"
      startIcon={<IconComponent />}
      disabled={isSubmitting}
      loading={isSubmitting}
      loadingPosition="start"
      color={!isDefaultValue && isValid ? 'primary' : 'inherit'}
      onClick={onClick}
    >
      {text ?? 'Save'}
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
