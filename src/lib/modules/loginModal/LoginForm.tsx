import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setSnackbar, setSnackbarWithPreset } from '@/lib/modules/snackbar';
import { authClient } from '@/lib/utils/auth-client';
import { useAppForm } from '@/lib/utils/form';
import {
  createSignUpSchema,
  SignInSchema,
  signInSchema,
  SignUpSchema,
} from './schema';
import { LoginModalProps } from './types';

type LoginFormProps = Pick<
  LoginModalProps,
  'onClose' | 'callbackURL' | 'disableStrictPasswordRequirements'
> & {
  signUp: boolean;
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginForm({
  signUp,
  setSignUp,
  onClose,
  callbackURL,
  disableStrictPasswordRequirements,
}: LoginFormProps) {
  const router = useRouter();

  const signInForm = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    } as SignInSchema,
    // Making this asyncronous enables the loading spinner on the sign in button
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL,
        },
        {
          onSuccess: async () => {
            onClose?.();
            const session = await authClient.getSession();
            setSnackbarWithPreset(
              'success',
              `Welcome back ${session.data?.user.name}!`,
            );
          },
          onError: (ctx) => {
            setSnackbarWithPreset('errorWithMessage', ctx.error.message);
          },
        },
      );
    },
    validators: {
      onSubmit: signInSchema,
    },
  });

  const signUpSchema = createSignUpSchema({
    disableStrictPasswordRequirements: disableStrictPasswordRequirements,
  });
  const signUpForm = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as SignUpSchema,
    // Making this asyncronous enables the loading spinner on the sign up button
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: '/get-started',
        },
        {
          onSuccess: () => {
            router.push('/get-started');
            onClose?.();
          },
          onError: (ctx) => {
            setSnackbarWithPreset('errorWithMessage', ctx.error.message);
          },
        },
      );
    },
    validators: {
      onSubmit: signUpSchema,
    },
  });

  // Sync email and password fields between forms
  useEffect(() => {
    const signInValues = signInForm.store.state.values;
    const signUpValues = signUpForm.store.state.values;

    if (signUp) {
      if (signInValues.email)
        signUpForm.setFieldValue('email', signInValues.email);
      if (signInValues.password)
        signUpForm.setFieldValue('password', signInValues.password);
    } else {
      if (signUpValues.email)
        signInForm.setFieldValue('email', signUpValues.email);
      if (signUpValues.password)
        signInForm.setFieldValue('password', signUpValues.password);
    }
  }, [signInForm, signUp, signUpForm]);

  if (signUp) {
    return (
      <signUpForm.AppForm>
        <form
          className="my-4 w-full px-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
            <signUpForm.AppField
              name="name"
              validators={{ onBlur: signUpSchema.shape.name }}
            >
              {(field) => (
                <field.TextField
                  label="Name"
                  autoComplete="name"
                  className="w-full"
                />
              )}
            </signUpForm.AppField>
            <signUpForm.AppField
              name="email"
              validators={{ onBlur: signUpSchema.shape.email }}
            >
              {(field) => (
                <field.TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  className="w-full"
                />
              )}
            </signUpForm.AppField>
            <signUpForm.AppField
              name="password"
              validators={{ onChange: signUpSchema.shape.password }}
            >
              {(field) => (
                <field.TextField
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full"
                  helperText="At least 8 varied characters"
                />
              )}
            </signUpForm.AppField>
            <signUpForm.AppField
              name="confirmPassword"
              validators={{
                onChangeListenTo: ['password'],
                onChange: ({ value, fieldApi }) => {
                  if (
                    value !== fieldApi.form.getFieldValue('password') &&
                    fieldApi.state.meta.isTouched
                  ) {
                    return { message: 'Passwords must match' };
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <field.TextField
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full"
                />
              )}
            </signUpForm.AppField>
            <div className="flex w-full flex-wrap items-center justify-end gap-2">
              <Button
                variant="text"
                className="text-neutral-500 normal-case dark:text-neutral-400"
                color="inherit"
                onClick={() => {
                  setSignUp(false);
                }}
              >
                Back
              </Button>
              <signUpForm.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    variant="contained"
                    className="normal-case"
                    loading={isSubmitting}
                    loadingPosition="start"
                    onClick={() => signUpForm.handleSubmit()}
                  >
                    Sign up
                  </Button>
                )}
              </signUpForm.Subscribe>
            </div>
          </div>
        </form>
      </signUpForm.AppForm>
    );
  } else {
    return (
      <signInForm.AppForm>
        <form
          className="my-4 w-full px-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
            <signInForm.AppField name="email">
              {(field) => (
                <field.TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  className="w-full"
                />
              )}
            </signInForm.AppField>
            <signInForm.AppField name="password">
              {(field) => (
                <field.TextField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full"
                />
              )}
            </signInForm.AppField>

            <div className="flex w-full flex-wrap items-center justify-end gap-2">
              <Button
                variant="text"
                className="text-neutral-500 normal-case dark:text-neutral-400"
                color="inherit"
                onClick={() => {
                  setSnackbar({
                    message: 'Tough luck ¯\\_(ツ)_/¯',
                    closeOn: { dismiss: true },
                  });
                }}
              >
                Forgot password
              </Button>
              <signInForm.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    variant="contained"
                    className="normal-case"
                    loading={isSubmitting}
                    loadingPosition="start"
                    onClick={() => signInForm.handleSubmit()}
                  >
                    Sign in
                  </Button>
                )}
              </signInForm.Subscribe>
            </div>
          </div>
        </form>
      </signInForm.AppForm>
    );
  }
}
