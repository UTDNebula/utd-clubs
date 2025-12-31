'use client';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useRef } from 'react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';

export const AllTags = ({
  name,
  className,
  options = [],
}: {
  name: string;
  className?: string;
  options?: string[];
}) => {
  const { tags, setTags, setShouldFocus } = useSearchStore((s) => s);
  const didChangeRef = useRef(false);

  function scrollToResults() {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  }

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    didChangeRef.current = true;
    const next = event.target.value as string[];
    setTags(next);
  };

  const handleClose = () => {
    if (!didChangeRef.current) return;
    didChangeRef.current = false;

    setShouldFocus(false);
    scrollToResults();
    setShouldFocus(true);
  };

  const sorted = [...new Set(options)].sort((a, b) => a.localeCompare(b));

  return (
    <FormControl className={className}>
      <Select
        id="all-tags-select"
        multiple
        size="small"
        value={tags}
        onChange={handleChange}
        onClose={handleClose}
        displayEmpty
        renderValue={() => name}
        className="rounded-full font-bold text-white"
        MenuProps={{ PaperProps: { className: 'max-h-60 rounded-xl' } }}
      >
        <MenuItem disabled value="">
          <em>Select any tags</em>
        </MenuItem>

        {sorted.map((tag) => (
          <MenuItem key={tag} value={tag}>
            <Checkbox checked={tags.includes(tag)} />
            <ListItemText primary={tag} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
