'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Panel from '@nebula-library/components/Panel';
import Confirmation from '@/lib/components/Confirmation';
import { setSnackbarWithPreset } from '@/lib/modules/snackbar';
import { authClient } from '@/lib/utils/auth-client';
import { useAppForm } from '@/lib/utils/form';
import {
  changeEmailSchema,
  ChangeEmailSchema,
  changePasswordSchema,
  ChangePasswordSchema,
  deleteAccountSchema,
  DeleteAccountSchema,
} from '../settingsSchema';

type ManageAccountTab = 'email' | 'password' | 'delete';

type ManageAccountProps = { disableEmailAuth?: boolean };

export default function ManageAccount({
  disableEmailAuth,
}: ManageAccountProps) {
  const session = authClient.useSession();
  const router = useRouter();

  const [tab, setTab] = useState<ManageAccountTab>(
    disableEmailAuth ? 'delete' : 'email',
  );
  const handleChangeTab = (
    e: React.SyntheticEvent,
    newTab: ManageAccountTab,
  ) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  const changeEmailForm = useAppForm({
    defaultValues: {
      newEmail: '',
    } as ChangeEmailSchema,
    // Making this asyncronous enables the loading spinner on the save button
    onSubmit: async ({ value }) => {
      await authClient.changeEmail(
        {
          newEmail: value.newEmail,
        },
        {
          onSuccess: async () => {
            const session = await authClient.getSession();
            setSnackbarWithPreset(
              'success',
              `Changed your email to ${session.data?.user.email}!`,
            );
            changeEmailForm.reset();
          },
          onError: (ctx) => {
            setSnackbarWithPreset('errorWithMessage', ctx.error.message);
          },
        },
      );
    },
    validators: { onChange: changeEmailSchema },
  });

  const changePasswordForm = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } as ChangePasswordSchema,
    onSubmit: async ({ value }) => {
      await authClient.changePassword(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        },
        {
          onSuccess: () => {
            setSnackbarWithPreset('success', `Changed your password!`);
            changePasswordForm.reset();
          },
          onError: (ctx) => {
            setSnackbarWithPreset('errorWithMessage', ctx.error.message);
          },
        },
      );
    },
    validators: { onSubmit: changePasswordSchema },
  });

  const deleteAccountForm = useAppForm({
    defaultValues: {
      confirmation: '',
    } as DeleteAccountSchema,
    onSubmit: () => {
      setOpenDeleteAccountConfirmation(true);
    },
    validators: { onChange: deleteAccountSchema },
  });
  const [openDeleteAccountConfirmation, setOpenDeleteAccountConfirmation] =
    useState(false);

  const tabs = [
    ...(disableEmailAuth
      ? []
      : [
          <Tab
            key="email"
            value="email"
            label="Change Email"
            aria-label="change email"
            className="text-nowrap normal-case sm:px-8"
          />,
        ]),
    ...(disableEmailAuth
      ? []
      : [
          <Tab
            key="password"
            value="password"
            label="Change Password"
            aria-label="change password"
            className="text-nowrap normal-case sm:px-8"
          />,
        ]),
    <Tab
      key="delete"
      value="delete"
      label="Delete Account"
      aria-label="delete account"
      className="text-nowrap normal-case sm:px-8"
    />,
  ];

  return (
    <Panel heading="Manage Account">
      <div className="flex w-full flex-col gap-8 p-2 sm:flex-row sm:gap-4">
        <Tabs
          orientation="horizontal"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          className="sm:hidden [&:has(.MuiTabScrollButton-root)]:-m-4"
          value={tab}
          onChange={handleChangeTab}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs}
        </Tabs>

        <Tabs
          orientation="vertical"
          className="shrink-0 max-sm:hidden"
          value={tab}
          onChange={handleChangeTab}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          {tabs}
        </Tabs>

        {tab === 'email' && (
          <changeEmailForm.AppForm>
            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                changeEmailForm.handleSubmit();
              }}
            >
              <div className="flex max-w-lg flex-col gap-6">
                <TextField
                  value={session.data?.user.email ?? 'Loading...'}
                  size="small"
                  disabled
                  label="Current Email"
                  className="w-full"
                />
                <changeEmailForm.AppField name="newEmail">
                  {(field) => (
                    <field.TextField
                      label="New Email"
                      type="email"
                      autoComplete="email"
                      className="w-full"
                    />
                  )}
                </changeEmailForm.AppField>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <changeEmailForm.ResetButton />
                <changeEmailForm.SubmitButton />
              </div>
            </form>
          </changeEmailForm.AppForm>
        )}
        {tab === 'password' && (
          <changePasswordForm.AppForm>
            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                changePasswordForm.handleSubmit();
              }}
            >
              <div className="flex max-w-lg flex-col gap-6">
                <changePasswordForm.AppField name="currentPassword">
                  {(field) => (
                    <field.TextField
                      label="Current Password"
                      type="password"
                      autoComplete="password"
                      className="w-full"
                    />
                  )}
                </changePasswordForm.AppField>
                <changePasswordForm.AppField
                  name="newPassword"
                  validators={{
                    onChange: changePasswordSchema.shape.newPassword,
                  }}
                >
                  {(field) => (
                    <field.TextField
                      label="New Password"
                      type="password"
                      autoComplete="new-password"
                      className="w-full"
                      helperText="At least 8 varied characters"
                    />
                  )}
                </changePasswordForm.AppField>
                <changePasswordForm.AppField
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ['newPassword'],
                    onChange: ({ value, fieldApi }) => {
                      if (
                        value !== fieldApi.form.getFieldValue('newPassword') &&
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
                </changePasswordForm.AppField>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <changePasswordForm.ResetButton />
                <changePasswordForm.SubmitButton />
              </div>
            </form>
          </changePasswordForm.AppForm>
        )}
        {tab === 'delete' && (
          <deleteAccountForm.AppForm>
            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                deleteAccountForm.handleSubmit();
              }}
            >
              <div className="flex max-w-lg flex-col gap-6 select-none">
                <Typography variant="body2">
                  This will permanently delete your account from UTD Clubs.
                </Typography>
                <Typography variant="body2">
                  To confirm you really want to delete your account, please
                  fully type: <br /> &quot;Yes, I would like to delete my
                  account&quot;
                </Typography>
                <deleteAccountForm.AppField name="confirmation">
                  {(field) => (
                    <field.TextField
                      placeholder="Yes, I would like to delete my account"
                      className="w-full"
                    />
                  )}
                </deleteAccountForm.AppField>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <deleteAccountForm.Subscribe
                    selector={(state) => ({
                      disabled: state.isDefaultValue || state.isSubmitting,
                      isValid: state.isValid,
                    })}
                  >
                    {({ disabled, isValid }) => (
                      <Button
                        variant="text"
                        className="normal-case"
                        disabled={disabled}
                        color={isValid ? 'inherit' : 'primary'}
                        onClick={() => {
                          deleteAccountForm.reset();
                        }}
                      >
                        Never mind!
                      </Button>
                    )}
                  </deleteAccountForm.Subscribe>
                  <deleteAccountForm.Subscribe
                    selector={(state) => state.isDefaultValue || !state.isValid}
                  >
                    {(disabled) => (
                      <Button
                        type="submit"
                        variant="contained"
                        className="normal-case"
                        startIcon={<DeleteIcon />}
                        disabled={disabled}
                        color={disabled ? 'inherit' : 'error'}
                      >
                        Delete Account
                      </Button>
                    )}
                  </deleteAccountForm.Subscribe>
                </div>
              </div>
            </form>
          </deleteAccountForm.AppForm>
        )}
        <Confirmation
          open={openDeleteAccountConfirmation}
          onClose={() => setOpenDeleteAccountConfirmation(false)}
          contentText={
            <>
              This will permanently delete your account. <br />
              All your account data will be immediately removed from the
              platform.
            </>
          }
          onConfirm={async () => {
            await authClient.deleteUser();
            router.push('/');
            setSnackbarWithPreset(
              'success',
              'Account deleted! Sorry to see you go 😔',
            );
          }}
        />
      </div>
    </Panel>
  );
}
