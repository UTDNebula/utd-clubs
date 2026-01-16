'use client';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer, IconButton } from '@mui/material';
import { useState } from 'react';
import { type personalCats } from '@src/constants/categories';
import NavMenu from './NavMenu';

const NewSidebar = ({
  userCapabilities,
  homepage = false,
}: {
  userCapabilities: Array<(typeof personalCats)[number]>;
  homepage?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        className={`z-50 ${homepage ? ' drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
        size="large"
      >
        <MenuIcon
          fontSize="inherit"
          className={homepage ? 'fill-white' : 'fill-haiti dark:fill-white'}
        />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            className:
              'w-3/4 gap-4 bg-slate-100 dark:bg-neutral-900 py-6 shadow-lg sm:max-w-sm',
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
