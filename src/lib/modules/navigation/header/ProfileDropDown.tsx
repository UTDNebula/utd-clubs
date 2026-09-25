'use client';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Avatar,
  Button,
  Card,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Binoculars } from '@/lib/icons/OtherIcons';
import { openLoginModal } from '@/lib/modules/loginModal';
import { authClient } from '@/lib/utils/auth-client';
import { getAvailableSocialProviders } from '@/lib/utils/socialProviders';
import { auth } from '@/server/auth';

type ProfileDropDownProps = {
  shadow?: boolean;
  initialSession?: typeof auth.$Infer.Session | null;
};

export function ProfileDropDownFallback({
  shadow = false,
}: ProfileDropDownProps) {
  return (
    <Button
      variant="contained"
      color="inherit"
      disableElevation
      startIcon={
        <AccountCircleOutlinedIcon fontSize="large" className="text-2xl" />
      }
      className={`h-10 bg-slate-100 px-5 py-2 whitespace-nowrap text-slate-950 normal-case hover:bg-slate-200 dark:bg-slate-300 dark:hover:bg-slate-400 ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
    >
      Sign in
    </Button>
  );
}

export default function ProfileDropDown({
  shadow = false,
  initialSession,
}: ProfileDropDownProps) {
  useEffect(() => {
    if (initialSession) authClient.hydrateSession(initialSession);
  }, [initialSession]);

  const { data, isPending, isRefetching } = authClient.useSession();
  const session = isPending || !isRefetching ? initialSession : data;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const router = useRouter();
  const queryClient = useQueryClient();

  const handlePrefetchAvailableSocialProviders = () => {
    queryClient.prefetchQuery({
      queryKey: ['loginModal', 'getAvailableSocialProviders'],
      queryFn: () => getAvailableSocialProviders(),
      staleTime: Infinity,
    });
  };

  // Close on scroll
  useEffect(() => {
    if (open) {
      const handleScroll = () => {
        setAnchorEl(null);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [open]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (session !== null) {
      setAnchorEl(open ? null : e.currentTarget);
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      {session ? (
        <Avatar
          alt={session.user.name}
          src={session.user.image ?? undefined}
          onClick={handleClick}
          onMouseEnter={handlePrefetchAvailableSocialProviders}
          onFocus={handlePrefetchAvailableSocialProviders}
          component="button"
          className={`cursor-pointer ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
        >
          {session.user.name.charAt(0)}
        </Avatar>
      ) : (
        <>
          <IconButton
            size="large"
            className={`h-10 w-10 bg-slate-100 text-slate-950 normal-case hover:bg-slate-200 sm:hidden dark:bg-slate-300 dark:hover:bg-slate-400 ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
            aria-label="Log in"
            onClick={handleClick}
          >
            <AccountCircleOutlinedIcon fontSize="large" className="text-2xl" />
          </IconButton>
          <Button
            variant="contained"
            color="inherit"
            disableElevation
            onClick={handleClick}
            startIcon={
              <AccountCircleOutlinedIcon
                fontSize="large"
                className="text-2xl"
              />
            }
            className={`h-10 bg-slate-100 px-5 py-2 whitespace-nowrap text-slate-950 normal-case hover:bg-slate-200 max-sm:hidden dark:bg-slate-300 dark:hover:bg-slate-400 ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
          >
            Sign in
          </Button>
        </>
      )}
      {!isPending && session && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ horizontal: 'right', vertical: -8 }}
          disableScrollLock
          onClose={() => setAnchorEl(null)}
        >
          <Card>
            <MenuList>
              <MenuItem divider component={Link} href="/settings">
                <ListItemIcon>
                  <Avatar
                    alt={session.user.name}
                    src={session.user.image ?? undefined}
                    className="h-6 w-6"
                  />
                </ListItemIcon>
                <div>
                  {session.user.name}
                  <Typography
                    variant="caption"
                    gutterBottom
                    sx={{ display: 'block' }}
                  >
                    {session.user.email}
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem component={Link} href="/club-match">
                <ListItemIcon>
                  <Binoculars className="text-[1.25rem]" />
                </ListItemIcon>
                <ListItemText>Club Match</ListItemText>
              </MenuItem>
              <MenuItem component={Link} href="/settings">
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push('/');
                        router.refresh();
                      },
                    },
                  });
                  setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign out</ListItemText>
              </MenuItem>
            </MenuList>
          </Card>
        </Popover>
      )}
    </>
  );
}
