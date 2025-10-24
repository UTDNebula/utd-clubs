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
import { type Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  session: Session | null;
};

export const ProfileDropDown = ({ session }: Props) => {
  const avatarRef = useRef(null);
  const [open, setOpen] = useState(false);

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
            void signIn();
          }
        }}
        component="button"
        className="cursor-pointer"
      />
      <Popover
        open={open}
        anchorEl={avatarRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ horizontal: 'left', vertical: -8 }}
        disableScrollLock={true}
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
            <MenuItem component="button" onClick={() => void signOut()}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </MenuList>
        </Card>
      </Popover>
    </>
  );
};
