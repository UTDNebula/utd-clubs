import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormAutocompleteFreeSolo } from '@src/common/components/form/FormAutocomplete';
import {
  FormResetButton,
  FormSubmitButton,
} from '@src/common/components/form/FormButtons';
import FormFieldSet from '@src/common/components/form/FormFieldSet';
import FormQuestion from '@src/common/components/form/FormQuestion';
import FormSelect from '@src/common/components/form/FormSelect';
import FormTextField from '@src/common/components/form/FormTextField';
import { FormWizard, FormWizardStep } from '@src/common/components/form/FormWizard';

// export useFieldContext for use in your custom components
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField: FormTextField,
    Select: FormSelect,
    AutocompleteFreeSolo: FormAutocompleteFreeSolo,
  },
  formComponents: {
    ResetButton: FormResetButton,
    SubmitButton: FormSubmitButton,
    FieldSet: FormFieldSet,
    Question: FormQuestion,
    Wizard: FormWizard,
    WizardStep: FormWizardStep,
  },
});
