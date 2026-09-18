import { setSnackbar } from '@/lib/modules/snackbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

type LoginFormProps = {
  signUp: boolean;
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginForm({ signUp, setSignUp }: LoginFormProps) {
  if (signUp) {
    return (
      <div className="my-4 w-full px-4">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
          <TextField
            label="Name"
            autoComplete="name"
            size="small"
            className="w-full"
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            size="small"
            className="w-full"
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            size="small"
            className="w-full"
            helperText="Alphanumeric, a symbol, at least 8 characters"
          />
          <TextField
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            size="small"
            className="w-full"
          />
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
            <Button variant="contained" className="normal-case">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="my-4 w-full px-4">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            size="small"
            className="w-full"
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            size="small"
            className="w-full max-w-sm"
          />
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
            <Button variant="contained" className="normal-case">
              Sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
