import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  FormResetButton,
  FormSubmitButton,
} from '@src/components/form/FormButtons';

// export useFieldContext for use in your custom components
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {},
  formComponents: {
    FormResetButton,
    FormSubmitButton,
  },
});
