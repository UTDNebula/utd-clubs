'use client';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer, IconButton } from '@mui/material';
import { useState } from 'react';
import { type personalCats } from '@src/constants/categories';
import NavMenu from './NavMenu';

const NewSidebar = ({
  userCapabilities,
  hamburger = 'black',
  shadow = false,
}: {
  userCapabilities: Array<(typeof personalCats)[number]>;
  hamburger?: 'white' | 'black';
  shadow?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        className={`z-50 ${shadow ? ' drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
        size="large"
      >
        <MenuIcon
          fontSize="inherit"
          className={hamburger === 'black' ? 'fill-black' : 'fill-white'}
        />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            className:
              'w-3/4 gap-4 border-r bg-slate-100 py-6 shadow-lg sm:max-w-sm',
          },
        }}
      >
        <NavMenu userCapabilites={userCapabilities} />
        <IconButton
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4"
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </>
  );
};

export default NewSidebar;
