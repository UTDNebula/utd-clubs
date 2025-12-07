'use client';

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
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import RegisterModal from '@src/components/RegisterModal';
import { authClient } from '@src/utils/auth-client';

type Props = {
  shadow?: boolean;
};

export const ProfileDropDown = ({ shadow = false }: Props) => {
  const { data: session } = authClient.useSession();
  const avatarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Close on scroll
  useEffect(() => {
    if (open) {
      const handleScroll = () => {
        setOpen(false);
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
        ref={avatarRef}
        alt={session?.user.name ?? undefined}
        src={session?.user.image ?? undefined}
        onClick={() => {
          if (session !== null) {
            setOpen(!open);
          } else {
            setShowRegister(true);
          }
        }}
        component="button"
        className={`cursor-pointer ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
      />
      <Popover
        open={open}
        anchorEl={avatarRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ horizontal: 'left', vertical: -8 }}
        disableScrollLock
        onClose={() => setOpen(false)}
      >
        <Card>
          <MenuList>
            <MenuItem component={Link} href="/settings">
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem
              component="button"
              onClick={async () => {
                await authClient.signOut();
                setOpen(false);
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
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
};
