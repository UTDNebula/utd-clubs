'use client';

import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRef, useState } from 'react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';

export const AllTags = ({
  options = [],
  label = '•••',
}: {
  options?: string[];
  label?: string;
}) => {
  const { tags, setTags, setShouldFocus } = useSearchStore((s) => s);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const didChangeRef = useRef(false);

  function scrollToResults() {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleChange = (tag: string) => {
    didChangeRef.current = true;

    setTags(
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  };

  const handleClose = () => {
    setAnchorEl(null);

    if (!didChangeRef.current) return;
    didChangeRef.current = false;

    scrollToResults();
    setShouldFocus(true);
  };

  const sorted = [...new Set(options)].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        size="small"
        className="drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
        onClick={handleOpen}
      >
        {label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ className: 'max-h-40 mt-2 rounded-xl' }}
        MenuListProps={{ onClick: (e) => e.stopPropagation() }}
      >
        {sorted.map((tag) => (
          <MenuItem key={tag} onClick={() => handleChange(tag)}>
            <ListItemText primary={tag} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
