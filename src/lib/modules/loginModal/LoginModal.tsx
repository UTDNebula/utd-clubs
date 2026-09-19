'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { use, useState } from 'react';
import { setSnackbar, SnackbarPresets } from '@/lib/modules/snackbar';
import { authClient } from '@/lib/utils/auth-client';
import { getAvailableSocialProviders } from '@/lib/utils/socialProviders';
import LoginForm from './LoginForm';
import LoginProviderButton from './LoginProviderButton';
import { LoginModalProps, LoginProviders } from './types';

const loginProviderButtons = [
  'google',
  'discord',
] as const satisfies LoginProviders[];

export const LoginModalContents = ({
  className,
  onClose,
  closeButton,
  callbackURL,
  explanationText,
  disableEmailAuth,
  disablePasswordRequirements,
  loginBannerText,
}: Pick<
  LoginModalProps,
  | 'className'
  | 'onClose'
  | 'closeButton'
  | 'callbackURL'
  | 'explanationText'
  | 'disableEmailAuth'
  | 'disablePasswordRequirements'
  | 'loginBannerText'
>) => {
  const { data: availableSocialProviders } = useQuery({
    queryKey: ['loginModal', 'getAvailableSocialProviders'],
    queryFn: () => getAvailableSocialProviders(),
    placeholderData: ['google', 'discord', 'microsoft'],
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const microsoftDisabled = !availableSocialProviders?.includes('microsoft');

  const [signUp, setSignUp] = useState(false);

  const handleSignIn = () => {
    void authClient.signIn.social(
      {
        provider: 'microsoft',
        callbackURL: callbackURL ?? window.location.href,
        newUserCallbackURL: '/get-started',
      },
      {
        onError: (ctx) => {
          setSnackbar(SnackbarPresets.errorWithMessage(ctx.error.message));
        },
      },
    );
  };

  return (
    <div
      className={`z-20 flex w-fit flex-col items-center rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-800 dark:shadow-xl ${className}`}
    >
      <div className="flex h-fit w-full flex-col">
        {closeButton && (
          <div className="self-end sm:absolute">
            <IconButton onClick={onClose} aria-label="close modal">
              <CloseRoundedIcon />
            </IconButton>
          </div>
        )}
        <Typography
          variant="h1"
          className="font-display mt-1 mb-2 grow-1 self-center text-center text-2xl font-bold text-balance text-neutral-700 dark:text-neutral-300"
        >
          {signUp ? 'Sign up for UTD Clubs' : 'Sign in to UTD Clubs'}
        </Typography>
        {explanationText && (
          <Alert
            severity="info"
            className="mx-4 mt-1 mb-2 max-w-sm self-center px-4 sm:max-w-md"
          >
            {explanationText}
          </Alert>
        )}
        {!disableEmailAuth && (
          <Typography
            variant="body1"
            className="mt-1 mb-2 grow-1 self-center px-4 text-center text-neutral-600 dark:text-neutral-400"
          >
            {signUp ? (
              <a
                href="#"
                className="text-royal dark:text-cornflower-300 font-bold whitespace-nowrap underline underline-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  setSignUp(false);
                }}
              >
                Back to sign in
              </a>
            ) : (
              <>
                Need an account?{' '}
                <a
                  href="#"
                  className="text-royal dark:text-cornflower-300 font-bold whitespace-nowrap underline underline-offset-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setSignUp(true);
                  }}
                >
                  Sign up now!
                </a>
              </>
            )}
          </Typography>
        )}
      </div>
      {!disableEmailAuth && (
        <>
          <LoginForm
            signUp={signUp}
            setSignUp={setSignUp}
            onClose={onClose}
            callbackURL={callbackURL}
            disablePasswordRequirements={disablePasswordRequirements}
          />
          {loginBannerText && (
            <Alert severity="info" className="mx-4 mb-4 max-w-sm">
              {loginBannerText}
            </Alert>
          )}
          <Divider className="w-full px-4">
            <Typography variant="body2" color="textDisabled">
              Or
            </Typography>
          </Divider>
        </>
      )}
      <div className="flex w-full flex-col items-center justify-center gap-3 p-4 sm:flex-row">
        {loginProviderButtons.map((loginProvider) => (
          <LoginProviderButton
            key={loginProvider}
            provider={loginProvider}
            callbackURL={callbackURL}
            disabled={!availableSocialProviders?.includes(loginProvider)}
          />
        ))}
      </div>
      <Typography
        variant="body1"
        className="mt-1 mb-2 grow-1 self-center px-4 text-center text-neutral-600 dark:text-neutral-400"
      >
        Are you UTD Faculty/Staff?{' '}
        <Tooltip
          title={
            <>
              Microsoft oAuth is unavailable
              <br />
              Missing environment variables?
            </>
          }
          disableFocusListener={!microsoftDisabled}
          disableHoverListener={!microsoftDisabled}
          disableTouchListener={!microsoftDisabled}
          disableInteractive
        >
          <span>
            <a
              href={microsoftDisabled ? undefined : '#'}
              className={`font-bold whitespace-nowrap underline underline-offset-2 transition-[color] select-none ${microsoftDisabled ? 'text-neutral-600 dark:text-neutral-400' : 'text-slate-600 dark:text-slate-400'}`}
              onClick={
                microsoftDisabled
                  ? undefined
                  : () => {
                      handleSignIn();
                    }
              }
            >
              Sign in here
            </a>
          </span>
        </Tooltip>
      </Typography>
    </div>
  );
};

const LoginModal = ({
  open,
  onClose,
  closeButton,
  className,
  callbackURL,
  explanationText,
  disableEmailAuth: disableEmailAuthProp,
  disablePasswordRequirements: disablePasswordRequirementsProp,
  loginBannerText: loginBannerTextProp,
  flagPromises,
  ...props
}: LoginModalProps) => {
  const {
    emailAuth: emailAuthPromise,
    passwordRequirements: passwordRequirementsPromise,
    loginBannerText: loginBannerTextPromise,
  } = flagPromises ?? {};

  const enableEmailAuth = disableEmailAuthProp
    ? !disableEmailAuthProp
    : emailAuthPromise
      ? use(emailAuthPromise)
      : undefined;
  const enablePasswordRequirements = disablePasswordRequirementsProp
    ? !disablePasswordRequirementsProp
    : passwordRequirementsPromise
      ? use(passwordRequirementsPromise)
      : undefined;
  const loginBannerText = loginBannerTextProp
    ? loginBannerTextProp
    : loginBannerTextPromise
      ? use(loginBannerTextPromise)
      : undefined;

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`flex overflow-scroll pt-4 sm:p-4 ${className}`}
      {...props}
    >
      {/* This span is required to receive the tabIndex prop, which will let the user quickly navigate the modal using the keyboard */}
      <span className="m-auto">
        <LoginModalContents
          onClose={onClose}
          closeButton={closeButton ?? true}
          callbackURL={callbackURL}
          explanationText={explanationText}
          disableEmailAuth={!enableEmailAuth}
          disablePasswordRequirements={!enablePasswordRequirements}
          loginBannerText={loginBannerText}
        />
      </span>
    </Modal>
  );
};

export default LoginModal;
