'use client';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Avatar,
  Card,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@src/utils/auth-client';
import { useRegisterModal } from '../account/RegisterModalProvider';

type Props = {
  shadow?: boolean;
};

export const ProfileDropDown = ({ shadow = false }: Props) => {
  const { data: session } = authClient.useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const { setShowRegisterModal } = useRegisterModal();

  const router = useRouter();

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

  return (
    <>
      <Avatar
        alt={session?.user.name ?? undefined}
        src={session?.user.image ?? undefined}
        onClick={(e) => {
          if (session !== null) {
            setAnchorEl(open ? null : e.currentTarget);
          } else {
            setShowRegisterModal(true);
          }
        }}
        component="button"
        className={`cursor-pointer ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
      />
      {session && (
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
                    className="w-6 h-6"
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
              <MenuItem component={Link} href="/club-match/results">
                <ListItemIcon>
                  <Diversity3Icon fontSize="small" />
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
};
