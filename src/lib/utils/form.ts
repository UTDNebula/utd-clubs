import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormAutocompleteFreeSolo } from '@/lib/components/form/FormAutocomplete';
import {
  FormResetButton,
  FormSubmitButton,
} from '@/lib/components/form/FormButtons';
import FormFieldSet from '@/lib/components/form/FormFieldSet';
import FormMultiSelect from '@/lib/components/form/FormMultiSelect';
import FormQuestion, {
  FieldQuestion,
} from '@/lib/components/form/FormQuestion';
import FormRadioGroup from '@/lib/components/form/FormRadioGroup';
import FormSelect from '@/lib/components/form/FormSelect';
import FormTextField from '@/lib/components/form/FormTextField';
import { FormWizard, FormWizardStep } from '@/lib/components/form/FormWizard';

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
    MultiSelect: FormMultiSelect,
    RadioGroup: FormRadioGroup,
    Question: FieldQuestion,
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
