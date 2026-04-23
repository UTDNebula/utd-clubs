'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import AdminHeader from '@src/components/admin/AdminHeader';
import Panel from '@src/components/common/Panel';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';

const emailSchema = z.object({
  to: z
    .string()
    .min(1, 'At least one email is required')
    .refine((val) => {
      const emails = val
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      return (
        emails.length > 0 && emails.every((e) => z.email().safeParse(e).success)
      );
    }, 'Invalid email address(es)'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
});

export default function EmailPage() {
  const api = useTRPC();
  const sendEmail = useMutation(
    api.email.queue.mutationOptions({
      onSuccess: (data) => {
        setSnackbar(SnackbarPresets.savedCustom('Email queued successfully!'));
        console.log('Data:', data);
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.errorMessage(error.message));
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      to: '',
      subject: '',
      body: '',
    },
    onSubmit: async ({ value, formApi }) => {
      const toArray = value.to
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      await sendEmail.mutateAsync({
        ...value,
        to: toArray,
      });
      formApi.reset();
    },
    validators: {
      onChange: emailSchema,
    },
  });

  return (
    <>
      <AdminHeader path={[{ text: 'Admin', href: '/admin' }, 'Send Email']} />
      <div className="flex w-full flex-col items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-8 w-full max-w-4xl"
        >
          <Panel heading="Compose Email">
            <div className="m-2 flex flex-col gap-4">
              <form.AppField name="to">
                {(field) => (
                  <field.TextField
                    label="Target Emails (comma separated)"
                    className="w-full"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="subject">
                {(field) => (
                  <field.TextField
                    label="Subject"
                    className="w-full"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="body">
                {(field) => (
                  <field.TextField
                    label="Body"
                    className="w-full"
                    required
                    multiline
                    minRows={10}
                  />
                )}
              </form.AppField>
            </div>

            <div className="flex justify-end mt-4">
              <form.AppForm>
                <form.SubmitButton
                  text={sendEmail.isPending ? 'Sending...' : 'Send Email'}
                />
              </form.AppForm>
            </div>
          </Panel>
        </form>
      </div>
    </>
  );
}
