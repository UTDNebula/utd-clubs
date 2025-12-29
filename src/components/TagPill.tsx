'use client';

import Chip from '@mui/material/Chip';
import { useSearchStore } from '@src/utils/SearchStoreProvider';

export const TagPill = ({
  name,
  removeTag,
  className,
}: {
  name: string;
  removeTag?: () => void;
  className?: string;
}) => {
  const addTag = useSearchStore((state) => state.addTag);

  function scroll() {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  }

  return (
    <Chip
      label={name}
      className={
        'rounded-full font-bold transition-colors ' + (className ?? '')
      }
      color="primary"
      onClick={() => {
        addTag(name);
        scroll();
      }}
      onDelete={removeTag}
    />
  );
};
