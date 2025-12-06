import { withForm } from '@src/utils/form';

export const FormButtons = withForm({
  render: function Render({ form }) {
    return (
      <div className="flex flex-wrap justify-end items-center gap-2">
        <form.AppForm>
          <form.FormResetButton />
        </form.AppForm>
        <form.AppForm>
          <form.FormSubmitButton />
        </form.AppForm>
      </div>
    );
  },
});
