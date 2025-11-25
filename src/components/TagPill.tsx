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

  const firstInteracted = useSearchStore((s) => s.firstInteracted);
  const setFirstInteracted = useSearchStore((s) => s.setFirstInteracted);
  function scrollOnce() {
    if (!firstInteracted) {
      setFirstInteracted();
      document
        .getElementById('content')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <Chip
      label={`${name}`}
      className={
        'rounded-full font-bold transition-colors text-white ' +
        (className ?? '')
      }
      color="primary"
      onClick={() => {
        addTag(name);
        scrollOnce();
      }}
      onDelete={removeTag}
    />
  );
};
