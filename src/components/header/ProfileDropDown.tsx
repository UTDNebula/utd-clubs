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
import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import RegisterModal from '@src/components/RegisterModal';

type Props = {
  session: Session | null;
  shadow?: boolean;
};

export const ProfileDropDown = ({ session, shadow = false }: Props) => {
  const avatarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const pathname = usePathname();

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
            <MenuItem
              component="button"
              onClick={() => {
                const target = pathname?.startsWith('/settings')
                  ? '/'
                  : (pathname ?? '/');
                void signOut({ callbackUrl: target });
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
