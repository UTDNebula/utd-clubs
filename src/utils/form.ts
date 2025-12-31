import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  FormResetButton,
  FormSubmitButton,
} from '@src/components/form/FormButtons';
import FormSelect from '@src/components/form/FormSelect';
import FormTextField from '@src/components/form/FormTextField';

// export useFieldContext for use in your custom components
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    TextField: FormTextField,
    Select: FormSelect,
  },
  formComponents: {
    ResetButton: FormResetButton,
    SubmitButton: FormSubmitButton,
  },
});
